import {
  AIMessage,
  HumanMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import workflowConfig from "../config/workflow.config.js";
import { GraphStateUpdate } from "../agent/state.js";

const recentMessages = (messages: BaseMessage[]) => {
  return messages.slice(-workflowConfig.recentMessages);
};
const say = (text: string): GraphStateUpdate => {
  return { messages: [new AIMessage(text)] };
};

const findQuestion = (messages: BaseMessage[]) => {
  const question = [...messages]
    .reverse()
    .find((m) => HumanMessage.isInstance(m));
  return question?.text ?? "";
};

export { recentMessages, say, findQuestion };
