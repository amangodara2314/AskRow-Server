import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import model from "../agent.js";
import { GraphState, GraphStateUpdate } from "../state.js";
import { answerPrompt } from "../prompts/answer.prompt.js";
import { findQuestion, say } from "../../utils/agent.utils.js";

const answer = async (state: GraphState): Promise<GraphStateUpdate> => {
  const { result, sql } = state;

  const answer = await model.invoke([
    new SystemMessage(answerPrompt()),
    new HumanMessage(
      `Question: ${findQuestion(state.messages)}\n\n<results>\n${result}\n</results>`,
    ),
  ]);

  return say(`${answer.text}\n\n**Query used**\n\`\`\`sql\n${sql}\n\`\`\``);
};

export { answer };
