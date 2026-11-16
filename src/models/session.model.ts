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

  lastSeenAt: {
    type: Date,
    default: Date.now,
    required: false,
  },

  userAgent: String,
  ipHash: String,

  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },

  idleExpiresAt: {
    type: Date,
    required: true,
  },

  absoluteExpiresAt: {
    type: Date,
    required: true,
  },

  refreshVersion: {
    type: Number,
    default: 0,
  },

  revokedAt: Date,
  revokedReason: String,
});

sessionSchema.index({ userId: 1, status: 1 });

const Session = mongoose.model("Session", sessionSchema);

export type SessionDocument = InferSchemaType<typeof sessionSchema> & {
  _id?: mongoose.Types.ObjectId;
};

export default Session;
