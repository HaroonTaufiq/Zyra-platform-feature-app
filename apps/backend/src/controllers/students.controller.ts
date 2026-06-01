import type { Request, Response } from "express";
import { getActionCenter } from "../services/actionCenter.service.js";

/** GET /students/:id/action-center */
export function getStudentActionCenter(req: Request, res: Response): void {
  const { id } = req.params;
  const actionCenter = getActionCenter(id);

  if (!actionCenter) {
    res.status(404).json({
      error: "STUDENT_NOT_FOUND",
      message: `No student found with id '${id}'.`,
    });
    return;
  }

  res.json(actionCenter);
}
