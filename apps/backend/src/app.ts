import express, { type Express } from "express";
import cors from "cors";
import { studentsRouter } from "./routes/students.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";

// Allow the web client's origin. CORS_ORIGIN can be a comma-separated list;
// when unset (dev) the request origin is reflected so any localhost port works.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true;

/**
 * Builds the Express application.
 *
 * The app is created separately from the server entry point (`index.ts`) so
 * that integration tests can import and exercise it with Supertest without
 * opening a real network port.
 */
export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "zyra-action-center-api" });
  });

  app.use("/students", studentsRouter);
  app.use("/tasks", tasksRouter);

  return app;
}
