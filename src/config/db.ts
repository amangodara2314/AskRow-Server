import "dotenv/config";
import mongoose, { mongo } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is required to connect to database.");
}

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Unable to connect to database: ${message}`, {
      cause: error,
    });
  }
};

const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log("Unable to disconnect database");
  }
};

export { connectDb, disconnectDb };
