# MEMORY.md - Kalibra Mobile App

Inter-session project memory. Keep this file concise (about ~50 lines).

## Current status (2026-10-12)
- `feature/course-teacher-visibility` shows nullable teacher names in course cards/headers and patches student preferences.
- Auth uses native `token` cookies with credentials included; no JWT is stored in JavaScript.
- Generic typed fixtures and a fetch stub live only in `src/test`; production has no mock scenario.
- TypeScript and all 143 tests pass; ESLint has no errors (two existing MasteryRing inline-style warnings).
- Frontend audit has no errors; layer README warnings are expected by the user rule. StudentData is tested through service pagination tests.
- Android live verification confirms `2 resueltos` at 28% mastery, `Ejercicio 1 / 5` with five segments and adaptive difficulty `Nivel 1`; all five steps and code rendering pass integration tests.
- An earlier live response omitted difficulty; the latest includes it. Native code-card verification remains pending because received statements were prose; iOS is blocked by CoreSimulator access.
- Changes remain uncommitted by task instruction; the operator handles commits and push.
- US-024 dark mode persists the preference through HTTP; the dark palette remains pending.

## Decisions (and why)
- Course teacherName stays string | null through DTO/model/mapper; missing names display "Docente no disponible".
- Preferences use one PATCH /student-preferences/me with only changed fields; reminder time is preserved and defaults to 20:00:00 UTC when enabling without a stored time. Legacy PUT endpoints are removed from services and stubs.
- Screens -> hooks/useResource -> contract services -> one fetch client; no added native dependency.
- Pure statement splitting preserves prose/code order and source indentation; fenced language is retained, unmarked code gets no invented language or file name. Source is never evaluated.
- PracticeProvider shares hook-owned session state across exercise/result replacements. Five loaded exercises per subtopic visit; navigation away or account changes reset it. The fifth result returns to the subtopic.
- Exercise routes are replaced by results to avoid retaining answered exercises and growing the stack. Outcome recording is scoped to the active route; concurrent submissions are blocked.
- EASY/MEDIUM/HARD map to adaptive levels 1/2/3; missing difficulty, points and elapsed time remain hidden. Practiced subtopic notes use solved counts with singular/plural, falling back to level copy.
- `lastActivityAt` has no existing profile/progress label, so no UI or mapping is added for it.
- Android emulator uses 10.0.2.2:8080; iOS simulator uses localhost:8080. HTTP is allowed only for these Android debug hosts.
- Registration sends MOBILE_APP and splits the existing full-name field into firstName (first term) and lastName (remainder); sign-in after registration obtains the cookie.
- Protected 401 responses clear AuthContext; session generations prevent obsolete requests from publishing identity or cached results.
- Practice submits A-D keys once per action; results use an account-scoped attemptId cache and recover from paginated history when uncached.
- History loads every page per enrolled course, requests server outcome filters and counts each course's global totals once.
- Exact percentages come from student-progress; qualitative levels never become invented percentages. hasActivity controls the initial state.
- Missing faculty/term, duration, hints, code, session scores and estimated time are omitted. Server explanations are preserved without synthesized steps.
- Read-only data refreshes when navigation regains focus; practice generation is excluded to avoid unintended POST requests.
- Same token names as kalibra-web-app; README.md only in empty layer folders except the explicitly requested root README.

## Pitfalls to avoid
- Local API requires KALIBRA_SEED_GENERIC_USERS=true and JWT_COOKIE_SECURE=false for HTTP simulator sessions; never commit .env.
- Do not modify kalibra-api or kalibra-adaptive-engine from this task.
- iOS 27 requires UIScene; use iOS 26.x until AppDelegate adopts it.
- TypeScript 6: alias @/ uses paths without deprecated baseUrl.
- Jest: unmount navigation trees and flush timers to prevent work after teardown.

## Next steps
- Validate a native code card with a live statement containing code.
- Add a dark palette for US-024 and adopt UIScene for iOS 27.
