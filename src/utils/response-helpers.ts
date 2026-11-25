import { Response } from "express";

function successResponse(
  res: Response,
  statusCode: number,
  data: unknown,
  message: string = "Success",
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export { successResponse };
