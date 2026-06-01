import {
  students as rawStudents,
  tasks as rawTasks,
  messages as rawMessages,
} from "../data/mock-data.js";
import type {
  ActionCenter,
  Message,
  Student,
  Task,
  TaskPriority,
  TaskStatus,
  TaskSummary,
  Urgency,
} from "../types/index.js";

/**
 * The mock data is authored as plain JS object literals (so its IDs and
 * structure stay byte-for-byte identical to the brief). We assert the domain
 * types exactly once here, at the data boundary, and the rest of the codebase
 * works against the typed views. Mutations (PATCH task status) act on these
 * same array references — i.e. an in-memory store that resets on restart.
 */
const students = rawStudents as unknown as Student[];
const tasks = rawTasks as unknown as Task[];
const messages = rawMessages as unknown as Message[];

export const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];

/** Lower number = more urgent, used for task ordering. */
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function isValidStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && (VALID_STATUSES as string[]).includes(value);
}

const isOpen = (task: Task): boolean => task.status !== "completed";

/** Returns YYYY-MM-DD for the given moment (UTC), matching the dueDate format. */
const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const isOverdue = (task: Task, today: string): boolean =>
  isOpen(task) && task.dueDate < today;

/**
 * Aggregate urgency for the student. Documented rule:
 *  - high   : student is at_risk OR has an overdue urgent open task
 *  - medium : has an open high-priority task OR any overdue open task OR unread messages
 *  - low    : otherwise
 */
export function computeUrgency(
  student: Student,
  studentTasks: Task[],
  unreadMessagesCount: number,
  today: string,
): Urgency {
  const openTasks = studentTasks.filter(isOpen);
  const hasOverdueUrgent = openTasks.some(
    (t) => t.priority === "urgent" && t.dueDate < today,
  );

  if (student.enrollmentStatus === "at_risk" || hasOverdueUrgent) {
    return "high";
  }

  const hasOpenHigh = openTasks.some((t) => t.priority === "high");
  const hasOverdue = openTasks.some((t) => t.dueDate < today);

  if (hasOpenHigh || hasOverdue || unreadMessagesCount > 0) {
    return "medium";
  }

  return "low";
}

/** Open tasks first, then by priority, then by soonest due date. */
function sortTasks(a: Task, b: Task): number {
  if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
  if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  }
  return a.dueDate.localeCompare(b.dueDate);
}

/**
 * Build the aggregated action-center payload for a student.
 * Returns null when the student id is unknown (controller maps this to 404).
 */
export function getActionCenter(
  studentId: string,
  now: Date = new Date(),
): ActionCenter | null {
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const today = toDateKey(now);

  const studentTasks = tasks
    .filter((t) => t.studentId === studentId)
    .sort(sortTasks);

  const studentMessages = messages
    .filter((m) => m.studentId === studentId)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));

  const unreadMessagesCount = studentMessages.filter((m) => !m.read).length;

  const taskSummary: TaskSummary = {
    total: studentTasks.length,
    open: studentTasks.filter(isOpen).length,
    completed: studentTasks.filter((t) => t.status === "completed").length,
    overdue: studentTasks.filter((t) => isOverdue(t, today)).length,
  };

  return {
    student,
    urgency: computeUrgency(student, studentTasks, unreadMessagesCount, today),
    tasks: studentTasks,
    taskSummary,
    unreadMessagesCount,
    messages: studentMessages,
  };
}

/**
 * Update a task's status in the in-memory store.
 * Returns the updated task, or null when the task id is unknown.
 */
export function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  now: Date = new Date(),
): Task | null {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  task.status = status;
  task.updatedAt = now.toISOString();
  return task;
}
