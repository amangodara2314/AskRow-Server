import mongoose, { InferSchemaType } from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "revoked"],
    default: "active",
    required: true,
  },

  userAgent: String,
  ipHash: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },

  revokedAt: Date,
  revokedReason: String,
});

const Session = mongoose.model("Session", sessionSchema);

export type SessionDocument = InferSchemaType<typeof sessionSchema>;

export default Session;
