import { GraphState } from "../state.js";
import workflowConfig from "../../config/workflow.config.js";
import model from "../agent.js";
import * as z from "zod";
import { selectTablesPrompt } from "../prompts/select-tables.prompt.js";
import { say } from "../../utils/agent.utils.js";

export const selectTables = async (state: GraphState) => {
  const { tables } = state;
  if (tables.length === 0) {
    return say(
      "I couldn't find any tables this connection is allowed to read.",
    );
  }

  if (tables.length <= workflowConfig.selectAllThreshold) {
    return {
      selectedTables: tables,
    };
  }

  const outputStructure = z.object({
    dbTables: z
      .array(z.string())
      .describe("Relevant table names, exactly as listed"),
  });

  const { dbTables } = await model
    .withStructuredOutput(outputStructure)
    .invoke([selectTablesPrompt(tables), ...state.messages]);

  const known = new Set(tables);
  const selected = [...new Set(dbTables)]
    .filter((t) => known.has(t))
    .slice(0, workflowConfig.selectAllThreshold);

  if (selected.length === 0) {
    return say(
      "I couldn't find any relevant tables from the list of available tables.",
    );
  }

  return {
    selectedTables: selected,
  };
};
