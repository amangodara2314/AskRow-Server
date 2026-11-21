import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config";
import { DocId } from "../types";

const secret = process.env.ACCESS_TOKEN_SECRET || "";
const expiresIn = authConfig.ACCESS_TOKEN_EXPIRY;

if (!secret) {
  throw new Error("ACCESS_TOKEN_SECRET is missing");
}

type AccessTokenPayload = {
  userId: DocId;
  sessionId: DocId;
};

export function signAccessToken({ userId, sessionId }: AccessTokenPayload) {
  return jwt.sign({ userId, sessionId }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function validateAccessToken(token: string) {
  return jwt.verify(token, secret);
}
