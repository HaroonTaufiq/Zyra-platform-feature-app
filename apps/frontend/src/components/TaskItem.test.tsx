import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "./TaskItem";
import type { Task } from "../types";

const task: Task = {
  id: "tsk_001",
  studentId: "stu_001",
  title: "Submit FAFSA application",
  description: "Deadline is approaching.",
  status: "todo",
  priority: "urgent",
  dueDate: "2026-06-05",
  createdAt: "2026-05-13T14:00:00Z",
  updatedAt: "2026-05-13T14:00:00Z",
};

describe("TaskItem", () => {
  it("calls onStatusChange when the status dropdown changes", async () => {
    const onStatusChange = vi.fn();
    render(<TaskItem task={task} onStatusChange={onStatusChange} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /status for/i }),
      "in_progress",
    );

    expect(onStatusChange).toHaveBeenCalledWith("tsk_001", "in_progress");
  });

  it("disables the dropdown while updating", () => {
    render(<TaskItem task={task} onStatusChange={vi.fn()} isUpdating />);
    expect(screen.getByRole("combobox", { name: /status for/i })).toBeDisabled();
  });
});
