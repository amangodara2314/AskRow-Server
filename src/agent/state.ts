import { MessagesValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";

const State = new StateSchema({
  messages: MessagesValue,
  question: z.string(),
  tables: z.array(z.string()),
  tableSchemas: z.array(z.string()),
  sql: z.string(),
  results: z.string(),
  retryCount: z.number(),
});

export type GraphState = typeof State.State;
export type GraphStateUpdate = typeof State.Update;
export type GraphStateNode = typeof State.Node;

export default State;
