import { tool } from "@langchain/core/tools";
import pool from "../../config/db.js";
import { TableColumns } from "../../types/index.js";
import * as z from "zod";

const getColumnsSchema = z.object({
  tables: z
    .array(z.string().trim().min(1))
    .min(1)
    .describe("Names of the database tables to inspect"),
});

type GetColumnsParameters = z.infer<typeof getColumnsSchema>;

const getColumns = async ({
  tables,
}: GetColumnsParameters): Promise<TableColumns[]> => {
  const query = `
    SELECT 
        cols.table_name, 
        cols.column_name, 
        cols.data_type, 
        cols.is_nullable, 
        CASE 
            WHEN kcu.column_name IS NOT NULL THEN 'Foreign Key' 
            ELSE NULL 
        END AS constraint_type, 
        ccu.table_name AS referenced_table, 
        ccu.column_name AS referenced_column 
    FROM information_schema.columns cols 
    LEFT JOIN information_schema.key_column_usage kcu 
        ON cols.table_schema = kcu.table_schema 
        AND cols.table_name = kcu.table_name 
        AND cols.column_name = kcu.column_name 
    LEFT JOIN information_schema.constraint_column_usage ccu 
        ON kcu.constraint_name = ccu.constraint_name 
        AND kcu.table_schema = ccu.table_schema 
    LEFT JOIN information_schema.table_constraints tc 
        ON kcu.constraint_name = tc.constraint_name 
        AND kcu.table_schema = tc.table_schema 
        AND tc.constraint_type = 'FOREIGN KEY' 
    WHERE cols.table_schema = 'public' 
      AND cols.table_name = ANY($1)  -- Evaluates dynamically against the passed array
    ORDER BY cols.table_name, cols.ordinal_position;
  `;
  const result = await pool.query(query, [tables]);

  const tableMap = new Map<string, string[]>();

  for (const row of result.rows) {
    if (!tableMap.has(row.table_name)) {
      tableMap.set(row.table_name, []);
    }
    tableMap.get(row.table_name)!.push(row.column_name);
  }

  const output: TableColumns[] = Array.from(
    tableMap,
    ([table_name, table_columns]) => ({
      table_name,
      table_columns,
    }),
  );

  return output;
};

export const getColumnsTool = tool(
  async ({ tables }) => getColumns({ tables }),
  {
    name: "get_columns",
    description: "Get column names for the specified database tables.",
    schema: getColumnsSchema,
  },
);
