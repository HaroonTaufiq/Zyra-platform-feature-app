import type { Request, Response } from "express";
import { getActionCenter } from "../services/actionCenter.service.js";
import { AppError } from "../lib/AppError.js";

/** GET /students/:id/action-center */
export function getStudentActionCenter(req: Request, res: Response): void {
  const { id } = req.params;
  const actionCenter = getActionCenter(id);

  if (!actionCenter) {
    throw new AppError(
      404,
      "STUDENT_NOT_FOUND",
      `No student found with id '${id}'.`,
    );
  }

  res.json(actionCenter);
}
