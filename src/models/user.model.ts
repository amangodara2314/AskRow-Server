import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Name must be at least 2 character long"],
    maxLength: [20, "Name cannot be more than 20 character long"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minLength: [6, "Name must be at least 6 character long"],
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export type UserDocument = InferSchemaType<typeof userSchema>;

export default User;
