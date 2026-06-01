import type { Task, TaskStatus } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { formatDate, isOverdue, statusLabel } from "../lib/format";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];

export function TaskItem({
  task,
  onStatusChange,
  isUpdating = false,
}: {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  isUpdating?: boolean;
}) {
  const overdue = isOverdue(task.dueDate, task.status);
  const done = task.status === "completed";

  return (
    <li
      data-testid="task-item"
      className={`rounded-lg border border-slate-200 bg-white p-4 ${
        isUpdating ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            {overdue && (
              <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                Overdue
              </span>
            )}
          </div>
          <h3
            className={`mt-1.5 font-medium ${
              done ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>
          <p className="text-sm text-slate-500">{task.description}</p>
          <p className="mt-1 text-xs text-slate-400">
            Due {formatDate(task.dueDate)}
          </p>
        </div>

        <label className="flex flex-col items-end gap-1 text-xs text-slate-400">
          <span className="sr-only">Status for {task.title}</span>
          <select
            aria-label={`Status for ${task.title}`}
            value={task.status}
            disabled={isUpdating}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as TaskStatus)
            }
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none disabled:cursor-not-allowed"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </li>
  );
}
