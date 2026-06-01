import type { Student, TaskSummary, Urgency } from "../types";
import { UrgencyBadge } from "./UrgencyBadge";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
      <div className="text-lg font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export function StudentProfileCard({
  student,
  urgency,
  taskSummary,
  unreadMessagesCount,
}: {
  student: Student;
  urgency: Urgency;
  taskSummary: TaskSummary;
  unreadMessagesCount: number;
}) {
  const atRisk = student.enrollmentStatus === "at_risk";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {student.name}
          </h1>
          <p className="text-sm break-all text-slate-500">{student.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>Grade {student.grade}</span>
            <span aria-hidden>·</span>
            <span>GPA {student.gpa.toFixed(1)}</span>
            <span aria-hidden>·</span>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                atRisk
                  ? "bg-red-100 text-red-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {atRisk ? "At risk" : "Active"}
            </span>
          </div>
        </div>
        <UrgencyBadge urgency={urgency} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Open tasks" value={taskSummary.open} />
        <Stat label="Overdue" value={taskSummary.overdue} />
        <Stat label="Completed" value={taskSummary.completed} />
        <Stat label="Unread messages" value={unreadMessagesCount} />
      </div>
    </section>
  );
}
