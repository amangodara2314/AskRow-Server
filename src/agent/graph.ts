import { START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import State, { GraphState } from "./state.js";
import { getModelWithTool } from "./agent.js";
import getTables from "./nodes/get-tables.node.js";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { getColumnsTool } from "./tools/index.js";
import { systemMessage } from "./prompts/system.prompt.js";

const tools = [getColumnsTool];
const agent = getModelWithTool(tools);
const toolNode = new ToolNode(tools);

const callAgent = async (state: GraphState) => {
  const initialMessage =
    state.messages.length > 0 ? undefined : new HumanMessage(state.question);
  const messages = initialMessage
    ? [systemMessage, initialMessage]
    : [systemMessage, ...state.messages];
  const response = await agent.invoke(messages);
  return {
    messages: initialMessage ? [initialMessage, response] : [response],
  };
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
  messages: [],
  question: "What are the columns of the users table?",
});

console.log(result);

export default graph;
