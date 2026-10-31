import { START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import State, { GraphState } from "./state.js";
import { getModelWithTool } from "./agent.js";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { executeQueryTool } from "./tools/index.js";
import { buildSystemMessage } from "./prompts/system.prompt.js";
import {
  getSchema,
  getTables,
  selectTables,
  validateSqlNode,
} from "./nodes/index.js";
import { generateSql } from "./nodes/generate-sql.node.js";

// const tools = [executeQueryTool];
// const agent = getModelWithTool(tools);
// const toolNode = new ToolNode(tools);

// const callAgent = async (state: GraphState) => {
//   const response = await agent.invoke([
//     buildSystemMessage(state.selectedTables),
//     ...state.messages,
//   ]);
//   return { messages: [response] };
// };

const graph = new StateGraph(State)
  .addNode("getTables", getTables)
  .addNode("selectTables", selectTables)
  .addNode("getSchema", getSchema)
  .addNode("generateSql", generateSql)
  .addNode("validate", validateSqlNode)
  // .addNode("tools", toolNode)
  .addEdge(START, "getTables")
  .addEdge("getTables", "selectTables")
  .addEdge("selectTables", "generateSql")
  .compile();

const result = await graph.invoke({
  messages: [new HumanMessage("Column of students table?")],
});

console.log(result.messages[result.messages.length - 1].content);

export default graph;
