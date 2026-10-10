# MEMORY.md - Kalibra Mobile App

Inter-session project memory. Keep this file concise (about ~50 lines); remove stale details.

## Current status (2026-10-10)
- `feature/ui-integration` holds every student feature: auth, profile, courses/enrollment, adaptive practice, progress and history. UI only with mock services; no API.
- The app starts at SignIn; the demo account is documented in README. `docs/ui-integration-audit.md` records the partner-branch audit.
- US-024 dark mode is partial: the profile toggle persists the preference but no dark palette exists yet.

## Decisions (and why)
- Same token names as kalibra-web-app (`theme/tokens.ts` mirrors web `@theme`).
- Fonts linked natively (`react-native.config.js` + `npx react-native-asset`); file names equal PostScript names.
- Answers are submitted from the exercise screen; the result screen reads it by `attemptId` (no double submission).
- Exercises and subtopics are generic data; the mock reuses one sample exercise labelled per subtopic.
- `MOCK_SCENARIO` in `src/mocks/scenario.ts` switches to empty states.
- Progress and history mocks derive from `COURSES`/`SUBTOPICS`; history attempt ids use the practice format `ex-<subtopicId>:<optionId>` so "Ver desglose" opens ExerciseResult.
- README.md only in empty layer folders (user rule), so the ARCH-05 audit warning is expected.

## Lessons learned and mistakes to avoid
- iOS 27 simulator crashes on launch (UIScene lifecycle required by iOS 27, RN 0.87 template lacks it). Use iOS 26.x simulator.
- TypeScript 6: `baseUrl` is deprecated; alias `@/` uses only `paths`.
- Jest: use fake timers and unmount navigation trees, otherwise timers fire after teardown.

## Next steps
- Replace mocks with HTTP services behind the same contracts.
- Add a dark palette for US-024.
- Adopt UIScene in `AppDelegate.swift` before testing on iOS 27.
