import mongoose, { ClientSession, Types } from "mongoose";
import { signAccessToken } from "../../utils/access-token";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refresh-token";
import sessionRepository from "./session.repository";
import authConfig from "../../config/auth.config";

type CreateSessionParameters = {
  userId: Types.ObjectId;
  userAgent: string;
  ipHash: string;
};

type RotationResult =
  | {
      kind: "rotated";
      accessToken: string;
      refreshToken: string;
    }
  | { kind: "invalid" | "expired" | "reused" };

export async function createSession({
  userId,
  userAgent,
  ipHash,
}: CreateSessionParameters) {
  const sessionId = new Types.ObjectId();

  const accessToken = signAccessToken({
    userId: userId.toString(),
    sessionId: sessionId.toString(),
  });

  const now = new Date();

  const absoluteExpiresAt = new Date(
    now.getTime() + authConfig.SESSION_ABSOLUTE_EXPIRY_MS,
  );
  const idleExpiresAt = new Date(
    now.getTime() + authConfig.SESSION_IDLE_EXPIRY_MS,
  );

  const { token, tokenHash } = generateRefreshToken();

  await mongoose.connection.transaction(async (session: ClientSession) => {
    await sessionRepository.createSession(
      {
        _id: sessionId,
        status: "active",
        userId,
        userAgent,
        ipHash,
        absoluteExpiresAt,
        idleExpiresAt,
        createdAt: now,
        refreshVersion: 1,
      },
      session,
    );

    await sessionRepository.createRefreshToken(
      {
        createdAt: now,
        sessionId,
        status: "active",
        tokenHash,
      },
      session,
    );
  });

  return {
    accessToken,
    refreshToken: token,
    sessionId: sessionId.toString(),
  };
}

export async function rotateRefreshToken(token: string) {
  const tokenHash = hashRefreshToken(token);

  const replacement = generateRefreshToken();
  const replacedByTokenId = new Types.ObjectId();

  const result = await mongoose.connection.transaction(
    async (dbSession: ClientSession): Promise<RotationResult> => {
      const now = new Date();
      const dbRefreshToken = await sessionRepository.findRefreshTokenWithHash(
        tokenHash,
        { session: dbSession },
      );

      if (!dbRefreshToken) {
        return { kind: "invalid" };
      }

      const currentSession = await sessionRepository.findSessionById(
        dbRefreshToken.sessionId,
      );

      if (!currentSession) {
        return { kind: "invalid" };
      }

      if (
        currentSession.status === "revoked" ||
        dbRefreshToken.status === "revoked"
      ) {
        return { kind: "invalid" };
      }

      if (dbRefreshToken.status === "used") {
        await sessionRepository.revokeSession(
          currentSession._id,
          "refresh_token_reuse",
          now,
          dbSession,
        );
        return { kind: "reused" };
      }

      // check if the session has expired
      const expired =
        currentSession.idleExpiresAt.getTime() <= now.getTime() ||
        currentSession.absoluteExpiresAt.getTime() <= now.getTime();

      if (expired) {
        await sessionRepository.revokeSession(
          currentSession._id,
          "session_expired",
          now,
          dbSession,
        );

        return { kind: "expired" };
      }

      const nextIdleExpiresAt = new Date(
        Math.min(
          now.getTime() + authConfig.SESSION_IDLE_EXPIRY_MS,
          currentSession.absoluteExpiresAt.getTime(),
        ),
      );

      const sessionUpdate = await sessionRepository.updateSession(
        {
          _id: currentSession._id,
          status: "active",
          idleExpiresAt: { $gt: now },
          absoluteExpiresAt: { $gt: now },
        },
        {
          $set: {
            idleExpiresAt: nextIdleExpiresAt,
            lastSeenAt: now,
          },
          $inc: {
            refreshVersion: 1,
          },
        },
        {
          session: dbSession,
        },
      );

      if (sessionUpdate.matchedCount !== 1) {
        throw new Error("SESSION_STATE_CHANGED");
      }

      const refreshTokenUpdate = await sessionRepository.updateRefreshToken(
        {
          _id: dbRefreshToken._id,
          status: "active",
        },
        {
          $set: {
            status: "used",
            replacedByToken: replacedByTokenId,
            usedAt: now,
          },
        },
        {
          session: dbSession,
        },
      );

      if (refreshTokenUpdate.matchedCount !== 1) {
        throw new Error("REFRESH_TOKEN_STATE_CHANGED");
      }

      await sessionRepository.createRefreshToken(
        {
          _id: replacedByTokenId,
          sessionId: currentSession._id,
          tokenHash: replacement.tokenHash,
          status: "active",
        },
        dbSession,
      );

      const accessToken = signAccessToken({
        sessionId: currentSession._id,
        userId: currentSession._id,
      });

      return {
        kind: "rotated",
        refreshToken: replacement.token,
        accessToken,
      };
    },
  );

  if (result.kind !== "rotated") {
    throw new Error(
      result.kind === "reused"
        ? "REFRESH_TOKEN_REUSE"
        : "INVALID_OR_EXPIRED_SESSION",
    );
  }

  return result;
}
