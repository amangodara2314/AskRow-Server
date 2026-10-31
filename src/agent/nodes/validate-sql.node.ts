import { parse } from "libpg-query";
import { GraphState, GraphStateUpdate } from "../state.js";

const FORBIDDEN_NODES = new Set([
  "InsertStmt",
  "UpdateStmt",
  "DeleteStmt",
  "MergeStmt",
  "CopyStmt",
  "DoStmt",
  "CallStmt",
  "VariableSetStmt",
  "TransactionStmt",
]);

const FORBIDDEN_FUNCS = new Set([
  "pg_sleep",
  "pg_read_file",
  "pg_read_binary_file",
  "pg_ls_dir",
  "pg_stat_file",
  "lo_import",
  "lo_export",
  "dblink",
  "dblink_exec",
  "set_config",
  "pg_terminate_backend",
  "pg_cancel_backend",
  "nextval",
  "setval",
  "pg_advisory_lock",
  "pg_advisory_xact_lock",
]);

const ALLOWED_SCHEMAS = new Set(["public"]);

type Validation =
  | { ok: true; sql: string; tables: string[] }
  | { ok: false; error: string };

async function validateSql(
  rawSql: string,
  allowedTables: Set<string>,
): Promise<Validation> {
  const sql = rawSql.trim().replace(/;+\s*$/, "");
  if (!sql) return { ok: false, error: "Empty query." };

  let ast: any;
  try {
    ast = await parse(sql);
  } catch (e: any) {
    return { ok: false, error: `Syntax error: ${e.message}` };
  }

  if (ast.stmts.length !== 1)
    return { ok: false, error: "Exactly one statement is allowed." };
  if (!ast.stmts[0].stmt.SelectStmt)
    return { ok: false, error: "Only SELECT queries are allowed." };

  const tables = new Set<string>();
  const cteNames = new Set<string>();
  let violation: string | null = null;

  const walk = (node: unknown): void => {
    if (violation || node === null || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);

    for (const [key, value] of Object.entries(node as Record<string, any>)) {
      if (FORBIDDEN_NODES.has(key)) {
        violation = `${key} is not allowed.`;
        return;
      }
      if (key === "SelectStmt") {
        if (value.intoClause) violation = "SELECT INTO is not allowed.";
        if (value.lockingClause?.length)
          violation = "Row locking (FOR UPDATE/SHARE) is not allowed.";
      }
      if (key === "CommonTableExpr") cteNames.add(value.ctename);
      if (key === "RangeVar") {
        if (value.schemaname && !ALLOWED_SCHEMAS.has(value.schemaname))
          violation = `Schema "${value.schemaname}" is not allowed.`;
        tables.add(value.relname);
      }
      if (key === "FuncCall") {
        const name = value.funcname
          ?.map((n: any) => n.String?.sval ?? n.String?.str)
          .pop()
          ?.toLowerCase();
        if (name && FORBIDDEN_FUNCS.has(name))
          violation = `Function ${name}() is not allowed.`;
      }
      walk(value);
    }
  };
  walk(ast.stmts[0].stmt);

  if (violation) return { ok: false, error: violation };

  const unknown = [...tables].filter(
    (t) => !cteNames.has(t) && !allowedTables.has(t),
  );
  if (unknown.length)
    return {
      ok: false,
      error: `Unknown tables: ${unknown.join(", ")}. Available: ${[...allowedTables].join(", ")}`,
    };

  return { ok: true, sql, tables: [...tables] };
}

export const validateSqlNode = async (
  state: GraphState,
): Promise<GraphStateUpdate> => {
  const { sql, selectedTables } = state;

  const result = await validateSql(sql, new Set(selectedTables));

  if (result.ok) {
    return { sql: result.sql, error: "" };
  }

  return { error: result.error, retryCount: state.retryCount + 1 };
};
