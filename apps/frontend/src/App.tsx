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
      <header className="bg-gradient-to-r from-brand-950 via-brand-800 to-brand-600">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/zyra-wordmark.png"
              alt="Zyra"
              className="h-7 w-auto"
            />
            <span className="hidden h-5 w-px bg-white/30 sm:block" />
            <span className="hidden text-sm font-medium text-white/80 sm:block">
              Counselor workspace
            </span>
          </div>
          <h1 className="text-lg font-semibold text-white">
            Student Action Center
          </h1>
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
                  ? "bg-brand-500 text-white shadow-sm"
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
