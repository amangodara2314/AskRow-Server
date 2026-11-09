import mongoose, { InferSchemaType } from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.ObjectId,
    ref: "Session",
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "used", "revoked"],
    default: "active",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  tokenHash: {
    type: String,
    required: true,
  },

  replacedByToken: {
    type: mongoose.Schema.ObjectId,
    ref: "RefreshToken",
  },
});

refreshTokenSchema.index({ tokenHash: 1 }, { unique: true });

refreshTokenSchema.index(
  {
    sessionId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "active",
    },
    name: "one_active_refresh_token_per_session",
  },
);

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export type RefreshTokenDocument = InferSchemaType<typeof refreshTokenSchema>;
