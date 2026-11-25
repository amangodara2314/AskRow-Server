import express from "express";
import authController from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);

export default authRouter;
