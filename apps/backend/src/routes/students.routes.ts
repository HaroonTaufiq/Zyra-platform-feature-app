import { Router } from "express";
import { getStudentActionCenter } from "../controllers/students.controller.js";

export const studentsRouter = Router();

studentsRouter.get("/:id/action-center", getStudentActionCenter);
