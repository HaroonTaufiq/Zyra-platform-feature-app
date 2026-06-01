/**
 * Operational error with an HTTP status and a stable machine-readable code.
 * Controllers throw these; the central error handler turns them into responses.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
