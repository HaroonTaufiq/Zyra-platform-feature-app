import { Router } from "express";
import { patchTaskStatus } from "../controllers/tasks.controller.js";

export const tasksRouter = Router();

tasksRouter.patch("/:taskId/status", patchTaskStatus);
