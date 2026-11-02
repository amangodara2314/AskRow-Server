import workflowConfig from "../../config/workflow.config.js";
import { say } from "../../utils/agent.utils.js";
import { GraphState, GraphStateUpdate } from "../state.js";

export const giveUp = async (state: GraphState): Promise<GraphStateUpdate> =>
  say(
    `I wasn't able to build a working query after ${workflowConfig.maxRetries} attempts.\n\n` +
      `Last problem: ${state.error}\n\nTry rephrasing the question or naming the tables or columns involved.`,
  );
