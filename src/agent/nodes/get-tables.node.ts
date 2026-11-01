import pool from "../../config/db.js";
import { GraphState, GraphStateUpdate } from "../state.js";

const getTables = async (state: GraphState): Promise<GraphStateUpdate> => {
  const query = `SELECT table_schema, table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema')`;

  const result = await pool.query(query);

  const output = result.rows.map((table) => table.table_name);

  return {
    tables: output,
  };
};

export { getTables };
