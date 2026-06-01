import type { TaskPriority } from "../types";

const STYLES: Record<TaskPriority, string> = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-blue-100 text-blue-800",
  low: "bg-slate-100 text-slate-600",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      data-testid="priority-badge"
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}
