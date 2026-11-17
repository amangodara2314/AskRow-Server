import { AppError, ErrorDetails } from "./app.error";

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", details: ErrorDetails) {
    super(message, 401, { code: "UNAUTHORIZED", details });
  }
}
