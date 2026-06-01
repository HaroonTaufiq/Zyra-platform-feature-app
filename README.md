# Zyra — Counselor Student Action Center

A small full-stack feature that helps a counselor quickly understand a student's
priorities, tasks, unread messages, and overall urgency level — and update task
status inline.

**🔗 Live demo:** https://zyra-action-center-web.onrender.com
&nbsp;·&nbsp; API: https://zyra-action-center-api.onrender.com/health

> Hosted on Render's free tier — the API sleeps when idle, so the first request
> after a pause may take ~30–60s to wake.

- **Backend:** Node.js · Express · TypeScript
- **Frontend:** React · TypeScript · Vite · Tailwind CSS v4 · TanStack Query
- **Monorepo:** npm workspaces (`apps/backend`, `apps/frontend`)

> **Task 2 (production hardening — logging, error middleware with request IDs,
> integration + frontend tests, CI) is merged into `main`** — see the
> [Task 2 section](#task-2--production-enhancements) below. The isolated
> Task 1 → Task 2 diff is preserved in
> [PR #1](https://github.com/HaroonTaufiq/Zyra-platform-feature-app/pull/1)
> (branch [`bonus`](../../tree/bonus)).

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
npm test               # runs tests in both workspaces (backend 14 + frontend 6)
npm run dev:backend    # API in watch mode (tsx)
npm run dev:frontend   # Vite dev server
```

## Deployment (Render)

A [`render.yaml`](render.yaml) Blueprint deploys both apps together — the API as a
Node web service and the web client as a static site.

1. In Render: **New → Blueprint**, connect this repo. Render reads `render.yaml`
   and proposes both services.
2. When prompted for **`VITE_API_URL`** (web service), enter the API's URL —
   typically `https://zyra-action-center-api.onrender.com`. Click **Apply**.
3. After both deploy, open the web service URL. If the API got a different URL
   than expected, update `VITE_API_URL` on the static site in the dashboard and
   trigger a redeploy.

Notes:
- The API is an **in-memory store**, so task edits reset when the free instance
  cold-starts or redeploys — expected for a demo.
- CORS is permissive by default (reflects the request origin). To lock it to the
  web app's origin, set `CORS_ORIGIN` on the API service (see `render.yaml`).
- Free web services sleep when idle, so the first request after a pause is slow.

---

## API contract

Base URL: `http://localhost:4000`. All responses are JSON. Errors share the shape
`{ "error": string, "message": string }` (plus `"requestId"` on the `bonus`
branch — see Task 2 below).

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

---

## Task 2 — Production Enhancements

Production-hardening work, developed on the `bonus` branch and merged into `main`
via [PR #1](https://github.com/HaroonTaufiq/Zyra-platform-feature-app/pull/1) (which
preserves the isolated Task 1 → Task 2 diff). It adds:

- **Request logging** — `morgan` logs every HTTP request (method, path, status,
  duration), prefixed with the request id. Quiet during tests.
- **Request IDs** — a `requestId` middleware assigns an `x-request-id` to each
  request (honouring an inbound header from a gateway), echoes it on the response,
  and includes it in **every error body**.
- **Central error middleware** — controllers throw a typed `AppError`; one handler
  maps known errors to their status/code and turns anything else into a logged
  `500`. A `notFoundHandler` covers unmatched routes.
- **Tests** — backend integration tests (Vitest + Supertest) for both endpoints
  (200/400/404 + payload shape) and unit tests for the urgency rule; frontend tests
  (Vitest + Testing Library + MSW) for the badge, the task status control, and the
  page's loading/error flows.
- **CI** — `.github/workflows/ci.yml` installs, builds, and runs both test suites
  on every push/PR. The run is the CI log deliverable; a captured local run is in
  [`docs/test-output.md`](docs/test-output.md).

Run everything locally:

```bash
npm install
npm test          # backend (14) + frontend (6) — all green
```

### Performance decisions & tradeoffs

- **Single aggregated endpoint.** `GET /students/:id/action-center` returns
  profile + tasks + summary + unread count + messages in one response. One round
  trip instead of three or four, and urgency/summary are computed once on the
  server rather than re-derived on every client. Tradeoff: a slightly larger,
  less granular payload — fine here, and easy to split or paginate later.
- **Server state via TanStack Query.** Caching, request de-duplication and
  background refetching come for free, so the page avoids redundant fetches and
  hand-rolled loading/error bookkeeping. `staleTime` keeps quick student-switching
  from refetching needlessly.
- **Optimistic task updates.** The status change is applied to the cache
  immediately for an instant feel, then **rolled back on error** and the query is
  **invalidated on settle** so derived fields (urgency, summary) re-sync with the
  source of truth. Tradeoff: extra rollback logic and one refetch per change in
  exchange for a snappy UI that can't drift from the server.
- **Request-id correlation.** Logs and error responses share one id, so a user
  report (“I got error X, request abc-123”) maps straight to the log line — cheap
  to add, high debugging leverage in production.
- **In-memory store.** Task updates mutate an array and reset on restart. Zero
  setup for the assessment; the service boundary is where a real repository + DB
  would slot in without touching controllers or the frontend.
- **One test runner (Vitest) across both apps.** Native ESM/TS, no `ts-jest`
  config, one mental model. Integration tests exercise the real Express app
  through Supertest (no port bound), so they catch routing/middleware/contract
  regressions a pure unit test would miss.
