export type ErrorDetails = {
  code?: string;
  details?: unknown;
};

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown[] | {} | null;
  constructor(
    message: string,
    statusCode: number,
    details?: unknown[] | {} | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }
  }
}
