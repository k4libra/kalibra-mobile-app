# MEMORY.md - Kalibra Mobile App

Inter-session project memory. Keep this file concise (about ~50 lines); remove stale details.

## Current status (2026-10-08)
- `develop` (pushed): tokens from Figma, `components/ui` primitives (Text, Icon by Material Symbols ligature, Button, ConfirmDialog, HeroBanner…), header/tab bar layout, React Navigation stack + tabs with `PlaceholderScreen`, mock services.
- Local branches (not pushed): `feature/courses-enrollment`, `feature/adaptive-practice`.
- Only UI and navigation: services point to `src/mocks`; no API integration yet.

## Decisions (and why)
- Same token names as kalibra-web-app (`theme/tokens.ts` mirrors web `@theme`).
- Fonts linked natively (`react-native.config.js` + `npx react-native-asset`); file names equal PostScript names.
- Answers are submitted from the exercise screen; the result screen reads it by `attemptId` (no double submission).
- Exercises and subtopics are generic data; the mock reuses one sample exercise labelled per subtopic.
- `MOCK_SCENARIO` in `src/mocks/scenario.ts` switches to empty states.

## Lessons learned and mistakes to avoid
- iOS 27 simulator crashes on launch (UIScene lifecycle required by iOS 27, RN 0.87 template lacks it). Use iOS 26.x simulator.
- TypeScript 6: `baseUrl` is deprecated; alias `@/` uses only `paths`.
- Jest: use fake timers and unmount navigation trees, otherwise timers fire after teardown.

## Next steps
- Partner branches: `feature/auth-profile`, `feature/progress-history` replace their placeholders.
- Adopt UIScene in `AppDelegate.swift` before testing on iOS 27.
