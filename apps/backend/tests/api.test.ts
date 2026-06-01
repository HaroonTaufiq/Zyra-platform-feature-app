import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

describe("GET /students/:id/action-center", () => {
  it("returns 200 with the aggregated payload", async () => {
    const res = await request(app).get("/students/stu_001/action-center");

    expect(res.status).toBe(200);
    expect(res.body.student.id).toBe("stu_001");
    expect(res.body.urgency).toBe("high");
    expect(res.body.unreadMessagesCount).toBe(2);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.taskSummary).toEqual({
      total: 5,
      open: 4,
      completed: 1,
      overdue: 1,
    });
  });

  it("returns 404 with an error code and request id for an unknown student", async () => {
    const res = await request(app).get("/students/stu_999/action-center");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("STUDENT_NOT_FOUND");
    expect(res.body.requestId).toBeTruthy();
  });
});

describe("CORS", () => {
  it("reflects the request origin so a browser client is allowed", async () => {
    const res = await request(app)
      .get("/students/stu_001/action-center")
      .set("Origin", "http://localhost:5173");

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
  });
});

describe("PATCH /tasks/:taskId/status", () => {
  it("updates a task status and returns 200", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_009/status")
      .send({ status: "completed" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("tsk_009");
    expect(res.body.status).toBe("completed");
    expect(res.body.updatedAt).toBeTruthy();
  });

  it("rejects an invalid status with 400", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_009/status")
      .send({ status: "not-a-status" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("INVALID_STATUS");
  });

  it("returns 404 for an unknown task", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_999/status")
      .send({ status: "todo" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("TASK_NOT_FOUND");
  });
});
