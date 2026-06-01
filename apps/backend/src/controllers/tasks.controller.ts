import type { Request, Response } from "express";
import {
  isValidStatus,
  updateTaskStatus,
  VALID_STATUSES,
} from "../services/actionCenter.service.js";
import { AppError } from "../lib/AppError.js";

/** PATCH /tasks/:taskId/status */
export function patchTaskStatus(req: Request, res: Response): void {
  const { taskId } = req.params;
  const { status } = (req.body ?? {}) as { status?: unknown };

  if (!isValidStatus(status)) {
    throw new AppError(
      400,
      "INVALID_STATUS",
      `'status' is required and must be one of: ${VALID_STATUSES.join(", ")}.`,
    );
  }

  const updated = updateTaskStatus(taskId, status);

  if (!updated) {
    throw new AppError(
      404,
      "TASK_NOT_FOUND",
      `No task found with id '${taskId}'.`,
    );
  }

  res.json(updated);
}
