import app from "./app";
import { connectDb, disconnectDb } from "./config/db";
import { getErrorMessage } from "./utils/helper";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT must be present in .env file to start the server");
}

const startServer = async (): Promise<void> => {
  try {
    await connectDb();
    const server = app.listen(PORT, () => {
      console.log(`Database connected and Server Start on Port ${PORT}`);
    });

    server.on("error", (error) => {
      const message = getErrorMessage(error);
      console.error(`Server failed to bind to port ${PORT}: ${message}`);
      process.exit(1);
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(`Error starting server ${message}`);
    process.exit(1);
  }
};

async function shutdownServer() {
  await disconnectDb();
  console.log("Shutting down gracefully...");
  process.exit(0);
}

process.on("SIGINT", shutdownServer);

process.on("SIGTERM", shutdownServer);

startServer();
