import { createHash, randomBytes } from "node:crypto";

export function generateRefreshToken() {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashRefreshToken(token);
  return {
    token,
    tokenHash,
  };
}

export function hashRefreshToken(token: string) {
  const tokenHash = createHash("sha264").update(token).digest("hex");
  return tokenHash;
}
