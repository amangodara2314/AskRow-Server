import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";

export default function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, success: false, details: err.details });
  }

  return res
    .status(500)
    .json({ message: "Internal Server Error", success: false });
}
