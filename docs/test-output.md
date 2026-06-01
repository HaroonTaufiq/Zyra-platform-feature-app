# Test output (Task 2)

Captured locally with: npm test (runs both workspaces).
Node v24.16.0

## Backend — vitest + supertest
```
 RUN  v2.1.9 /home/haroon/Downloads/Temp/Zyra-platform-feature-app/apps/backend

 ✓ tests/actionCenter.service.test.ts (8 tests) 16ms
 ✓ tests/api.test.ts (5 tests) 53ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  13:21:37
   Duration  550ms (transform 115ms, setup 0ms, collect 227ms, tests 69ms, environment 0ms, prepare 211ms)
```

## Frontend — vitest + Testing Library + MSW
```
 RUN  v2.1.9 /home/haroon/Downloads/Temp/Zyra-platform-feature-app/apps/frontend

 ✓ src/components/UrgencyBadge.test.tsx (2 tests) 49ms
 ✓ src/components/TaskItem.test.tsx (2 tests) 156ms
 ✓ src/pages/StudentActionCenter.test.tsx (2 tests) 157ms

 Test Files  3 passed (3)
      Tests  6 passed (6)
   Start at  13:21:38
   Duration  1.26s (transform 147ms, setup 502ms, collect 457ms, tests 362ms, environment 1.24s, prepare 223ms)
```
