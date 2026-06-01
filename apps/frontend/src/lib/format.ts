/** Format a YYYY-MM-DD or ISO date string as e.g. "Jun 5, 2026". */
export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** True when an open task's due date is in the past (compared by calendar day). */
export function isOverdue(dueDate: string, status: string): boolean {
  if (status === "completed") return false;
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today;
}

/** Human label for a task status. */
export function statusLabel(status: string): string {
  switch (status) {
    case "todo":
      return "To do";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}
