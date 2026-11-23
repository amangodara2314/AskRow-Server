import { createHmac } from "node:crypto";

const PASSWORD_SECRET = process.env.PASSWORD_SECRET || "";

export function hashPassword(password: string) {
  return createHmac("sha256", PASSWORD_SECRET)
    .update(password)
    .digest("hex")
    .toString();
}
