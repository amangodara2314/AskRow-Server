import { parse } from "pgsql-ast-parser";
import pool from "../../config/db.js";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const executeQuerySchema = z.object({
  query: z.string().describe("Sql query you want to execute"),
});

type ExecuteQueryParameters = z.infer<typeof executeQuerySchema>;

const executeQuery = async ({ query }: ExecuteQueryParameters) => {
  const statements = parse(query);

  if (statements.length !== 1) {
    throw new Error("Only one SQL statement is allowed");
  }

  if (statements[0].type !== "select") {
    throw new Error("Only SELECT queries are allowed");
  }

  const result = await pool.query(query);

  return result.rows;
};

const executeQueryTool = tool(
  ({ query }: ExecuteQueryParameters) => executeQuery({ query }),
  {
    name: "execute_query_tool",
    description: "A tool that execute given sql query",
    schema: executeQuerySchema,
  },
);

export { executeQueryTool };
