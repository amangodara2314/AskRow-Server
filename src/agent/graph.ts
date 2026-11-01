import { END, START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import State, { GraphState } from "./state.js";

import {
  getSchema,
  getTables,
  selectTables,
  validateSqlNode,
} from "./nodes/index.js";
import { generateSql } from "./nodes/generate-sql.node.js";
import { executeQuery } from "./nodes/execute-query.node.js";
import { answer } from "./nodes/answer.node.js";
import workflowConfig from "../config/workflow.config.js";

const afterGenerate = (state: GraphState) => (state.sql ? "validate" : END);

const retryOrContinue = (next: "execute" | "answer") => (state: GraphState) => {
  return state.error
    ? state.retryCount >= workflowConfig.maxRetries
      ? END
      : "generateSql"
    : next;
}; // replace this END with giveUp node

const graph = new StateGraph(State)
  .addNode("getTables", getTables)
  .addNode("selectTables", selectTables)
  .addNode("getSchema", getSchema)
  .addNode("generateSql", generateSql)
  .addNode("validate", validateSqlNode)
  .addNode("execute", executeQuery)
  .addNode("answer", answer)
  .addEdge(START, "getTables")
  .addEdge("getTables", "selectTables")
  .addEdge("selectTables", "getSchema")
  .addEdge("getSchema", "generateSql")
  .addConditionalEdges("generateSql", afterGenerate, ["validate", END])
  .addConditionalEdges("validate", retryOrContinue("execute"), [
    "generateSql",
    "execute",
    END,
  ])
  .addConditionalEdges("execute", retryOrContinue("answer"), [
    "answer",
    "generateSql",
    END,
  ])
  .addEdge("answer", END)
  .compile();

const result = await graph.invoke({
  messages: [new HumanMessage("List all student names")],
  retryCount: 0,
});

result.messages.forEach((val) => {
  console.log(val.content);
  console.log("/n/");
});

export default graph;
