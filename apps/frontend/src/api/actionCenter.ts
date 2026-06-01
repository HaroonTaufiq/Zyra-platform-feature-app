import { apiClient } from "./client";
import type { ActionCenter, Task, TaskStatus } from "../types";

/** GET /students/:id/action-center */
export async function fetchActionCenter(studentId: string): Promise<ActionCenter> {
  const { data } = await apiClient.get<ActionCenter>(
    `/students/${studentId}/action-center`,
  );
  return data;
}

/** PATCH /tasks/:taskId/status */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const { data } = await apiClient.patch<Task>(`/tasks/${taskId}/status`, {
    status,
  });
  return data;
}
