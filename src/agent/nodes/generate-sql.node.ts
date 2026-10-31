import * as z from "zod";
import { GraphState, GraphStateUpdate } from "../state.js";
import { HumanMessage } from "@langchain/core/messages";
import model from "../agent.js";
import { buildSystemMessage } from "../prompts/system.prompt.js";
import { recentMessages, say } from "../../utils/agent.utils.js";

const SqlOutput = z.object({
  sql: z
    .string()
    .nullable()
    .describe(
      "One PostgreSQL SELECT statement, or null if no query should be run",
    ),
  clarification: z
    .string()
    .nullable()
    .describe("Question or explanation for the user when sql is null"),
});

async function generateSql(state: GraphState) {
  const retryHint = state.error
    ? [
        new HumanMessage(
          `Your previous query was rejected.\n\nQuery:\n${state.sql}\n\nError:\n${state.error}\n\nReturn a corrected query.`,
        ),
      ]
    : [];

  const output = await model
    .withStructuredOutput(SqlOutput)
    .invoke([
      buildSystemMessage(state.tables),
      ...recentMessages(state.messages),
      ...retryHint,
    ]);

  if (!output.sql?.trim()) {
    return {
      sql: "",
      ...say(
        output.clarification ??
          "Could you rephrase or add more detail to your question?",
      ),
    };
  }

  return { sql: output.sql };
}

export { generateSql };
