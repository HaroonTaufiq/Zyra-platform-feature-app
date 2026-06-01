export type EnrollmentStatus = "active" | "at_risk";

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: EnrollmentStatus;
}

export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  studentId: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export type Urgency = "high" | "medium" | "low";

export interface TaskSummary {
  total: number;
  open: number;
  completed: number;
  overdue: number;
}

export interface ActionCenter {
  student: Student;
  urgency: Urgency;
  tasks: Task[];
  taskSummary: TaskSummary;
  unreadMessagesCount: number;
  messages: Message[];
}
