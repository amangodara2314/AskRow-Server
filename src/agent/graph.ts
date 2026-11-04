import { END, START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import State, { GraphState } from "./state.js";

import {
  answer,
  classifyIntent,
  executeQuery,
  generateSql,
  getSchema,
  getTables,
  giveUp,
  selectTables,
  validateSqlNode,
} from "./nodes/index.js";

import workflowConfig from "../config/workflow.config.js";

const afterGenerate = (state: GraphState) => (state.sql ? "validate" : END);

const retryOrContinue = (next: "execute" | "answer") => (state: GraphState) => {
  return state.error
    ? state.retryCount >= workflowConfig.maxRetries
      ? "giveUp"
      : "generateSql"
    : next;
};

const afterClassification = (state: GraphState) =>
  state.intent === "DATABASE_QUERY" ? "getTables" : END;

const graph = new StateGraph(State)
  .addNode("classifyIntent", classifyIntent)
  .addNode("getTables", getTables)
  .addNode("selectTables", selectTables)
  .addNode("getSchema", getSchema)
  .addNode("generateSql", generateSql)
  .addNode("validate", validateSqlNode)
  .addNode("execute", executeQuery)
  .addNode("answer", answer)
  .addEdge(START, "classifyIntent")
  .addConditionalEdges("classifyIntent", afterClassification, [
    "getTables",
    END,
  ])
  .addEdge("getTables", "selectTables")
  .addEdge("selectTables", "getSchema")
  .addEdge("getSchema", "generateSql")
  .addNode("giveUp", giveUp)
  .addConditionalEdges("generateSql", afterGenerate, ["validate", END])
  .addConditionalEdges("validate", retryOrContinue("execute"), [
    "generateSql",
    "execute",
    "giveUp",
  ])
  .addConditionalEdges("execute", retryOrContinue("answer"), [
    "answer",
    "generateSql",
    "giveUp",
  ])
  .addEdge("answer", END)
  .addEdge("giveUp", END)
  .compile();

const result = await graph.invoke({
  messages: [new HumanMessage("Hello! how to use this tool?")],
  retryCount: 0,
});

console.log(result.messages.map((m) => m.text).join("\n\n"));
console.log("Retry Count :", result.retryCount);

export default graph;
