import { MessagesValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";

const State = new StateSchema({
  messages: MessagesValue,
  question: z.string(),
  tables: z.array(z.string()),
  selectedTables: z.array(z.string()),
  selectedTablesSchema: z.array(
    z.object({ table_name: z.string(), table_columns: z.array(z.string()) }),
  ),
  sql: z.string(),
  error: z.string(),
  result: z.string(),
  retryCount: z.number(),
});

export type GraphState = typeof State.State;
export type GraphStateUpdate = typeof State.Update;
export type GraphStateNode = typeof State.Node;

export default State;
