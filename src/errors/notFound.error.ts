import { AppError, ErrorDetails } from "./app.error";

export class NotFoundError extends AppError {
  constructor(resource = "Resource", details: ErrorDetails) {
    super(`${resource} not found`, 404, { code: "NOT_FOUND", details });
  }
}
