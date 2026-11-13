class AppError extends Error {
  public statusCode: number;
  public errors: unknown[] | {} | null;
  constructor(
    message: string,
    statusCode: number,
    errors: unknown[] | {} | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
