import type { Request, Response } from "express";
import {
  isValidStatus,
  updateTaskStatus,
  VALID_STATUSES,
} from "../services/actionCenter.service.js";

/** PATCH /tasks/:taskId/status */
export function patchTaskStatus(req: Request, res: Response): void {
  const { taskId } = req.params;
  const { status } = (req.body ?? {}) as { status?: unknown };

  if (!isValidStatus(status)) {
    res.status(400).json({
      error: "INVALID_STATUS",
      message: `'status' is required and must be one of: ${VALID_STATUSES.join(", ")}.`,
    });
    return;
  }

  const updated = updateTaskStatus(taskId, status);

  if (!updated) {
    res.status(404).json({
      error: "TASK_NOT_FOUND",
      message: `No task found with id '${taskId}'.`,
    });
    return;
  }

  res.json(updated);
}
