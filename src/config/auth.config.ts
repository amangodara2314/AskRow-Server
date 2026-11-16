const authConfig = {
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",

  SESSION_ABSOLUTE_EXPIRY_MS: 30 * 24 * 60 * 60 * 1000,

  SESSION_IDLE_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
};

export default authConfig;
