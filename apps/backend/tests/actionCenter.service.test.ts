import { describe, it, expect } from "vitest";
import {
  computeUrgency,
  getActionCenter,
} from "../src/services/actionCenter.service.js";
import type { Student, Task } from "../src/types/index.js";

const TODAY = "2026-06-01";

const student = (overrides: Partial<Student> = {}): Student => ({
  id: "s",
  name: "Test",
  email: "test@school.edu",
  grade: 10,
  gpa: 3.0,
  counselorId: "csl_001",
  enrollmentStatus: "active",
  ...overrides,
});

const task = (overrides: Partial<Task> = {}): Task => ({
  id: "t",
  studentId: "s",
  title: "Task",
  description: "",
  status: "todo",
  priority: "low",
  dueDate: "2026-12-31",
  createdAt: "",
  updatedAt: "",
  ...overrides,
});

describe("computeUrgency", () => {
  it("is high when the student is at risk", () => {
    expect(
      computeUrgency(student({ enrollmentStatus: "at_risk" }), [], 0, TODAY),
    ).toBe("high");
  });

  it("is high when an open urgent task is overdue", () => {
    expect(
      computeUrgency(
        student(),
        [task({ priority: "urgent", dueDate: "2026-05-01" })],
        0,
        TODAY,
      ),
    ).toBe("high");
  });

  it("is medium for an open high-priority task", () => {
    expect(
      computeUrgency(student(), [task({ priority: "high" })], 0, TODAY),
    ).toBe("medium");
  });

  it("is medium when there are unread messages", () => {
    expect(computeUrgency(student(), [], 2, TODAY)).toBe("medium");
  });

  it("is low when nothing is pressing", () => {
    expect(computeUrgency(student(), [task()], 0, TODAY)).toBe("low");
  });

  it("ignores completed tasks when judging overdue urgency", () => {
    expect(
      computeUrgency(
        student(),
        [task({ priority: "urgent", status: "completed", dueDate: "2026-01-01" })],
        0,
        TODAY,
      ),
    ).toBe("low");
  });
});

describe("getActionCenter", () => {
  it("returns null for an unknown student", () => {
    expect(getActionCenter("stu_999")).toBeNull();
  });

  it("aggregates a known student deterministically", () => {
    const result = getActionCenter("stu_001", new Date("2026-06-01T12:00:00Z"));
    expect(result).not.toBeNull();
    expect(result!.urgency).toBe("high");
    expect(result!.unreadMessagesCount).toBe(2);
    expect(result!.taskSummary.total).toBe(5);
    // Open tasks are sorted ahead of completed ones.
    expect(result!.tasks[0].status).not.toBe("completed");
  });
});
