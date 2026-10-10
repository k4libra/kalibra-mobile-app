# MEMORY.md - Kalibra Mobile App

Inter-session project memory. Keep this file concise (about ~50 lines).

## Current status (2026-10-10)
- `feature/api-integration` replaces production mocks with real HTTP services for all student screens.
- Auth uses native `token` cookies with credentials included; no JWT is stored in JavaScript.
- Generic typed fixtures and a fetch stub live only in `src/test`; production has no mock scenario.
- TypeScript and all 113 tests pass; ESLint has no errors (two existing MasteryRing inline-style warnings).
- Frontend audit has no errors; layer README warnings are expected by the user rule. StudentData is tested through service pagination tests.
- Local API source still lacks contract-v2 `/users/me`, `/students/me/courses` and user names; live end-to-end/native verification awaits those backend changes.
- Commits remain pending: this environment exposes .git read-only; git add/commit fail creating index.lock. No staging or push was performed.
- US-024 dark mode persists the preference through HTTP; the dark palette remains pending.

## Decisions (and why)
- Screens -> hooks/useResource -> contract services -> one fetch client; no added native dependency.
- Android emulator uses 10.0.2.2:8080; iOS simulator uses localhost:8080. HTTP is allowed only for these Android debug hosts.
- Registration sends MOBILE_APP and splits the existing full-name field into firstName (first term) and lastName (remainder); sign-in after registration obtains the cookie.
- Protected 401 responses clear AuthContext; session generations prevent obsolete requests from publishing identity or cached results.
- Practice submits A-D keys once per action; results use an account-scoped attemptId cache and recover from paginated history when uncached.
- History loads every page per enrolled course, requests server outcome filters and counts each course's global totals once.
- Exact percentages come from student-progress; qualitative levels never become invented percentages. hasActivity controls the initial state.
- Missing faculty/term, duration, hints, code, session scores and estimated time are omitted. Server explanations are preserved without synthesized steps.
- Reminder time is preserved; enabling with no prior time sends 20:00:00 UTC, as required by the API.
- Read-only data refreshes when navigation regains focus; practice generation is excluded to avoid unintended POST requests.
- Same token names as kalibra-web-app; README.md only in empty layer folders except the explicitly requested root README.

## Pitfalls to avoid
- Local API requires KALIBRA_SEED_GENERIC_USERS=true and JWT_COOKIE_SECURE=false for HTTP simulator sessions; never commit .env.
- Do not modify kalibra-api or kalibra-adaptive-engine from this task.
- iOS 27 requires UIScene; use iOS 26.x until AppDelegate adopts it.
- TypeScript 6: alias @/ uses paths without deprecated baseUrl.
- Jest: unmount navigation trees and flush timers to prevent work after teardown.

## Next steps
- Validate native cookies and live flows once contract v2 is available in the API.
- Add a dark palette for US-024 and adopt UIScene for iOS 27.
