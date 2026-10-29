import { START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import State, { GraphState } from "./state.js";
import { getModelWithTool } from "./agent.js";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { executeQueryTool } from "./tools/index.js";
import { buildSystemMessage } from "./prompts/system.prompt.js";
import { getSchema, getTables, selectTables } from "./nodes/index.js";

const tools = [executeQueryTool];
const agent = getModelWithTool(tools);
const toolNode = new ToolNode(tools);

const callAgent = async (state: GraphState) => {
  const response = await agent.invoke([
    buildSystemMessage(state.selectedTables),
    ...state.messages,
  ]);
  return { messages: [response] };
};

const graph = new StateGraph(State)
  .addNode("getTables", getTables)
  .addNode("selectTables", selectTables)
  .addNode("getSchema", getSchema)
  .addNode("agent", callAgent)
  .addNode("tools", toolNode)
  .addEdge(START, "getTables")
  .addEdge("getTables", "selectTables")
  .addEdge("selectTables", "agent")
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")
  .compile();

const result = await graph.invoke({
  messages: [new HumanMessage("Name all the students?")],
});

console.log(result.messages[result.messages.length - 1].content);

export default graph;
