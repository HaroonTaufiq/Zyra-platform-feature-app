import { useState } from "react";
import { StudentActionCenter } from "./pages/StudentActionCenter";

// Counselor csl_001's caseload. There is no "list students" endpoint in the
// brief, so the known roster is used to drive a simple student switcher.
const STUDENTS = [
  { id: "stu_001", name: "Maya Patel" },
  { id: "stu_002", name: "Jordan Lee" },
  { id: "stu_003", name: "Carlos Rivera" },
];

export default function App() {
  const [studentId, setStudentId] = useState(STUDENTS[0].id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Zyra · Counselor workspace
          </p>
          <h1 className="text-xl font-bold">Student Action Center</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Students">
          {STUDENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStudentId(s.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                s.id === studentId
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100"
              }`}
            >
              {s.name}
            </button>
          ))}
        </nav>

        <StudentActionCenter studentId={studentId} />
      </main>
    </div>
  );
}
