import pool from "../../config/db.js";
import { GraphState } from "../state.js";

const executeQuery = async (state: GraphState) => {
  try {
    const { sql } = state;

    const result = await pool.query(sql);

    return {
      result: JSON.stringify(result.rows),
      error: "",
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    msg.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]").slice(0, 500);
    return {
      error: msg,
      retryCount: state.retryCount + 1,
    };
  }
};

export { executeQuery };
