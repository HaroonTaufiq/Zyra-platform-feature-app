import type { Task, TaskStatus } from "../types";
import { TaskItem } from "./TaskItem";

export function TaskList({
  tasks,
  onStatusChange,
  updatingTaskId,
}: {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  updatingTaskId?: string | null;
}) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No tasks for this student.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          isUpdating={updatingTaskId === task.id}
        />
      ))}
    </ul>
  );
}
