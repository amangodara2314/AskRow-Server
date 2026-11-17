import { AppError, ErrorDetails } from "./app.error";

export class ConflictError extends AppError {
  constructor(message = "Conflict", details: ErrorDetails) {
    super(message, 409, { code: "CONFLICT", ...details });
  }
}
