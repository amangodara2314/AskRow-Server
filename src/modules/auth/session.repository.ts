import mongoose, { ClientSession } from "mongoose";
import Session, { SessionDocument } from "../../models/session.model";
import {
  RefreshToken,
  RefreshTokenDocument,
} from "../../models/refreshToken.model";
import { DocId } from "../../types";

async function createSession(
  data: SessionDocument,
  dbSession: ClientSession | undefined,
) {
  const session = new Session(data);

  return dbSession ? session.save({ session: dbSession }) : session.save();
}

async function createRefreshToken(
  data: RefreshTokenDocument,
  dbSession: ClientSession | undefined,
) {
  const refreshToken = new RefreshToken(data);

  return dbSession
    ? refreshToken.save({ session: dbSession })
    : refreshToken.save();
}

async function findRefreshTokenWithHash(tokenHash: string, opts?: {}) {
  return RefreshToken.findOne({ tokenHash: tokenHash }, opts);
}

async function findUserActiveSession(userId: DocId, opts?: {}) {
  return await Session.findOne({ userId, status: "active" }, opts);
}

async function findSessionById(id: DocId, opts?: {}) {
  return await Session.findById(id, opts);
}

async function revokeSession(
  sessionId: DocId,
  reason: string,
  now: Date = new Date(),
  opts?: {},
) {
  await Session.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        status: "revoked",
        revokedAt: now,
        revokedReason: reason,
      },
    },
    opts,
  );

  await RefreshToken.findOneAndUpdate(
    { sessionId, status: "active" },
    { $set: { status: "revoked" } },
    opts,
  );
}

async function updateSessionById(id: DocId, data: {}, opts?: {}) {
  return await Session.findByIdAndUpdate(id, data, opts);
}

async function updateSession(where: {}, data: {}, opts?: {}) {
  return await Session.updateOne(where, data, opts);
}

async function updateRefreshToken(where: {}, data: {}, opts?: {}) {
  return await RefreshToken.updateOne(where, data, opts);
}

export default {
  createSession,
  createRefreshToken,
  findRefreshTokenWithHash,
  findUserActiveSession,
  findSessionById,
  revokeSession,
  updateSession,
  updateSessionById,
  updateRefreshToken,
};
