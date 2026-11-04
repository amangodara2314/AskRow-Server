import * as z from "zod";
import { GraphState, GraphStateUpdate } from "../state.js";
import { classificationModel } from "../agent.js";
import { classifyIntentPrompt } from "../prompts/index.js";
import { SystemMessage } from "@langchain/core/messages";
import { say } from "../../utils/agent.utils.js";

const OutputStructure = z.object({
  intent: z.enum(["DATABASE_QUERY", "IRRELEVANT"]),
  result: z.string(),
});
export const classifyIntent = async (
  state: GraphState,
): Promise<GraphStateUpdate> => {
  const output = await classificationModel
    .withStructuredOutput(OutputStructure)
    .invoke([new SystemMessage(classifyIntentPrompt()), ...state.messages]);

  const result = {
    intent: output.intent,
  };

  return output.intent === "IRRELEVANT"
    ? { ...result, ...say(output.result) }
    : result;
};
