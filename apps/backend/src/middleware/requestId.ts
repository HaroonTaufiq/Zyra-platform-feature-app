import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Correlation id for this request, surfaced in logs and error responses. */
      id: string;
    }
  }
}

/**
 * Assigns a correlation id to every request. Honours an inbound
 * `x-request-id` header (e.g. from a gateway/load balancer) and otherwise
 * generates one. The id is echoed back on the response header.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header("x-request-id");
  req.id = incoming && incoming.trim() !== "" ? incoming : randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
}
