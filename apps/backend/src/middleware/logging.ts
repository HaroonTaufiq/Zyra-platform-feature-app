import morgan from "morgan";
import type { Request } from "express";

// Expose the request id as a morgan token so each log line is correlatable.
morgan.token("id", (req) => (req as Request).id);

/**
 * HTTP request logger. Quiet during tests to keep test output readable.
 */
export const httpLogger = morgan(
  ":id :method :url :status :res[content-length] - :response-time ms",
  { skip: () => process.env.NODE_ENV === "test" },
);
