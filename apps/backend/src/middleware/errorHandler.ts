import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError.js";

/** Turns unmatched routes into a 404 AppError handed to the error handler. */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new AppError(404, "ROUTE_NOT_FOUND", `Cannot ${req.method} ${req.path}.`));
}

/**
 * Central error handler. Known AppErrors map to their status/code; anything
 * else is treated as an unexpected 500 and logged with the request id. Every
 * error response carries the requestId so a client report is traceable to a
 * log line.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : "INTERNAL_ERROR";
  const message = isAppError ? err.message : "An unexpected error occurred.";

  if (!isAppError) {
    // eslint-disable-next-line no-console
    console.error(`[${req.id}] Unhandled error:`, err);
  }

  res.status(statusCode).json({ error: code, message, requestId: req.id });
}
