# Zyra — Counselor Student Action Center

A small full-stack feature that helps a counselor quickly understand a student's
priorities, tasks, unread messages, and overall urgency level — and update task
status inline.

- **Backend:** Node.js · Express · TypeScript
- **Frontend:** React · TypeScript · Vite · Tailwind CSS v4 · TanStack Query
- **Monorepo:** npm workspaces (`apps/backend`, `apps/frontend`)

> **Task 2 (production hardening — logging, error middleware with request IDs,
> integration + frontend tests, CI) lives on the [`bonus`](../../tree/bonus)
> branch.** See its README section for performance notes and the CI run.

---

## Project layout

```
apps/
  backend/    Express + TypeScript API
    src/
      app.ts                       Express app factory (no listen — testable)
      index.ts                     server entry
      data/mock-data.ts            mock data, copied verbatim from the brief
      types/                       domain types
      services/                    urgency rule + aggregation + task update
      controllers/                 thin request/response handlers
      routes/                      route definitions
  frontend/   React + Vite client
    src/
      api/                         axios client + typed API calls
      components/                  profile card, task list, badges, states
      pages/StudentActionCenter    page: data fetching + optimistic mutation
      lib/                         small formatting helpers
      types/                       domain types (mirror of the API)
```

---

## Prerequisites

- **Node.js ≥ 20** and npm ≥ 9 (the repo uses npm workspaces).

## Setup

```bash
git clone https://github.com/HaroonTaufiq/Zyra-platform-feature-app.git
cd Zyra-platform-feature-app
npm install            # installs both workspaces
```

Optional environment files (sensible defaults are used if omitted):

```bash
cp apps/backend/.env.example  apps/backend/.env     # PORT=4000
cp apps/frontend/.env.example apps/frontend/.env    # VITE_API_URL=http://localhost:4000
```

## Run (development)

Use two terminals:

```bash
# Terminal 1 — API on http://localhost:4000
npm run dev:backend

# Terminal 2 — web app on http://localhost:5173
npm run dev:frontend
```

Open **http://localhost:5173**. Switch between students with the chips at the top,
change a task's status from its dropdown, and watch the badges/counts update.

## Build & other scripts

```bash
npm run build          # builds both workspaces
npm test               # runs tests in both workspaces (real tests on bonus branch)
npm run dev:backend    # API in watch mode (tsx)
npm run dev:frontend   # Vite dev server
```

---

## API contract

Base URL: `http://localhost:4000`. All responses are JSON. Errors share the shape
`{ "error": string, "message": string }`.

### `GET /health`
Liveness probe. → `200 { "status": "ok", "service": "zyra-action-center-api" }`

### `GET /students/:id/action-center`
Everything the counselor needs for one student, in a single round trip.

**200 OK**
```json
{
  "student": {
    "id": "stu_001", "name": "Maya Patel", "email": "maya.patel@school.edu",
    "grade": 11, "gpa": 3.2, "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "urgency": "high",
  "tasks": [ /* this student's tasks, sorted: open first, then priority, then due date */ ],
  "taskSummary": { "total": 5, "open": 4, "completed": 1, "overdue": 1 },
  "unreadMessagesCount": 2,
  "messages": [ /* this student's messages, newest first */ ]
}
```

**404 Not Found** — unknown student id
```json
{ "error": "STUDENT_NOT_FOUND", "message": "No student found with id 'stu_999'." }
```

### `PATCH /tasks/:taskId/status`
Update a single task's status.

**Request body**
```json
{ "status": "todo" | "in_progress" | "completed" }
```

| Status | When | Body |
| ------ | ---- | ---- |
| `200 OK` | status valid + task exists | the updated task (with refreshed `updatedAt`) |
| `400 Bad Request` | missing/invalid status | `{ "error": "INVALID_STATUS", "message": "..." }` |
| `404 Not Found` | unknown task id | `{ "error": "TASK_NOT_FOUND", "message": "..." }` |

Example:
```bash
curl -X PATCH http://localhost:4000/tasks/tsk_001/status \
  -H 'content-type: application/json' \
  -d '{"status":"completed"}'
```

### How `urgency` is computed
Derived server-side from the student + their tasks/messages (relative to today).
*Open* = status `todo` or `in_progress`; *overdue* = open and past its due date.

- **high** — student is `at_risk` **OR** has an overdue *urgent* open task
- **medium** — has an open *high*-priority task **OR** any overdue open task **OR** unread messages
- **low** — otherwise

---

## Architecture note

**Monorepo with npm workspaces.** Backend and frontend live in one repo under
`apps/*` so the whole feature clones, installs, and runs with one command, while
each app keeps its own `package.json`, build, and dependencies.

**Backend — layered, thin controllers.** Requests flow
`route → controller → service`. The **service** (`actionCenter.service.ts`) owns
all business logic: the urgency rule, task/message aggregation and sorting, and the
task-status update. Controllers only translate between HTTP and the service and pick
status codes. The Express app is built by a `createApp()` **factory** that is
separate from the server entry point, so tests can drive it with Supertest without
binding a port.

**Data layer.** The mock data is copied **verbatim** (IDs and structure unchanged)
into `src/data/mock-data.ts`. It's an in-memory store, so `PATCH` mutates the live
array and changes **reset on restart** — acceptable for the brief; in production this
becomes a repository interface over a database.

**One aggregated endpoint.** The page needs profile + tasks + unread count + urgency
together, so the API exposes a single `action-center` resource rather than making the
client stitch together three calls — fewer round trips and the urgency/summary are
computed once, authoritatively, on the server.

**Frontend — server state via TanStack Query.** The page reads through
`useQuery`; the status change is a `useMutation` with an **optimistic update**
(instant UI) that **rolls back on error** and **invalidates on settle** so derived
fields (urgency, summary) are refetched from the source of truth. Presentational
components (badges, cards, lists) are dumb and prop-driven, which keeps them trivial
to test. API types mirror the backend so the contract is enforced end-to-end.
