import { http, HttpResponse } from "msw";
import type { ActionCenter } from "../types";

const API = "http://localhost:4000";

export const actionCenterFixture: ActionCenter = {
  student: {
    id: "stu_001",
    name: "Maya Patel",
    email: "maya.patel@school.edu",
    grade: 11,
    gpa: 3.2,
    counselorId: "csl_001",
    enrollmentStatus: "at_risk",
  },
  urgency: "high",
  tasks: [
    {
      id: "tsk_001",
      studentId: "stu_001",
      title: "Submit FAFSA application",
      description: "Deadline is approaching.",
      status: "todo",
      priority: "urgent",
      dueDate: "2026-06-05",
      createdAt: "2026-05-13T14:00:00Z",
      updatedAt: "2026-05-13T14:00:00Z",
    },
  ],
  taskSummary: { total: 1, open: 1, completed: 0, overdue: 0 },
  unreadMessagesCount: 2,
  messages: [
    {
      id: "msg_001",
      studentId: "stu_001",
      from: "Mrs. Thompson (Math)",
      subject: "Maya missing assignments",
      preview: "Maya has not submitted the last three homework sets...",
      read: false,
      receivedAt: "2026-05-30T08:30:00Z",
    },
  ],
};

export const handlers = [
  http.get(`${API}/students/:id/action-center`, () =>
    HttpResponse.json(actionCenterFixture),
  ),
  http.patch(`${API}/tasks/:taskId/status`, async ({ request, params }) => {
    const body = (await request.json()) as { status: string };
    return HttpResponse.json({
      ...actionCenterFixture.tasks[0],
      id: params.taskId,
      status: body.status,
    });
  }),
];
