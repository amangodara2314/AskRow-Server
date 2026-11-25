import { Request, Response } from "express";
import { RegisterUserRequest } from "../../types";
import authService from "./auth.service";
import { successResponse } from "../../utils/response-helpers";

const registerUser = async (
  req: Request<{}, unknown, RegisterUserRequest>,
  res: Response,
) => {
  const data = req.body;
  const result = await authService.register(data);
  return successResponse(res, 201, null, result.message);
};

export default { registerUser };
