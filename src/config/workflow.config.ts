const init = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const workflowConfig = {
  // graph config
  selectAllThreshold: init(process.env.SELECT_ALL_THRESHOLD, 10),
  maxRetries: init(process.env.MAX_RETRIES, 3),
  recentMessages: init(process.env.RECENT_MESSAGES, 10),
  maxSelectedTables: init(process.env.MAX_SELECTED_TABLES, 5),
};

export default workflowConfig;
