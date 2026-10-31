import { AIMessage, type BaseMessage } from "@langchain/core/messages";
import workflowConfig from "../config/workflow.config.js";
import { GraphStateUpdate } from "../agent/state.js";

const recentMessages = (messages: BaseMessage[]) => {
  return messages.slice(-workflowConfig.recentMessages);
};
const say = (text: string): GraphStateUpdate => {
  return { messages: [new AIMessage(text)] };
};

export { recentMessages, say };
