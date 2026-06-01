import express, { type Express } from "express";

/**
 * Builds the Express application.
 *
 * The app is created separately from the server entry point (`index.ts`) so
 * that integration tests can import and exercise it with Supertest without
 * opening a real network port.
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "zyra-action-center-api" });
  });

  return app;
}
