import { START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import State, { GraphState } from "./state.js";
import { getModelWithTool } from "./agent.js";
import getTables from "./nodes/get-tables.node.js";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { getColumnsTool, executeQueryTool } from "./tools/index.js";
import { buildSystemMessage } from "./prompts/system.prompt.js";

const tools = [getColumnsTool, executeQueryTool];
const agent = getModelWithTool(tools);
const toolNode = new ToolNode(tools);

const callAgent = async (state: GraphState) => {
  const response = await agent.invoke([
    buildSystemMessage(state.tables),
    ...state.messages,
  ]);
  return { messages: [response] };
};

const graph = new StateGraph(State)
  .addNode("getTables", getTables)
  .addNode("agent", callAgent)
  .addNode("tools", toolNode)
  .addEdge(START, "getTables")
  .addEdge("getTables", "agent")
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")
  .compile();

const result = await graph.invoke({
  messages: [new HumanMessage("Name all the students?")],
});

console.log(result.messages[result.messages.length - 1].content);

export default graph;
