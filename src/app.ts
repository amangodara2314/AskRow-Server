import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import router from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(cors());

app.use("/api", router);

app.use(errorMiddleware);

export default app;
