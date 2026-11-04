import { ChatGoogle } from "@langchain/google";
import "dotenv/config";

const GOOGLE_API_KEY_SQL_AGENT = process.env.GOOGLE_API_KEY_SQL_AGENT || "";
const GOOGLE_API_KEY_CLASSIFICATION_AGENT =
  process.env.GOOGLE_API_KEY_CLASSIFICATION_AGENT || "";

const createModel = (apiKey: string) => {
  return new ChatGoogle("gemini-3.1-flash-lite", {
    apiKey,
    temperature: 0,
  });
};

const model = createModel(GOOGLE_API_KEY_SQL_AGENT);

export const classificationModel = createModel(
  GOOGLE_API_KEY_CLASSIFICATION_AGENT,
);

type Tools = Parameters<typeof model.bindTools>[0];

export const getModelWithTool = (tools: Tools) => {
  return model.bindTools(tools);
};

export default model;
