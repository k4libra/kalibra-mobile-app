# MEMORY.md - Kalibra Mobile App

## Current status (2026-11-16)
- UI v2 refactor is uncommitted on `feature/ui-v2-refactor`; never stage, commit, push or switch branches for this task.
- Exercise loading now uses the approved SVG calibration gauge and skeletons; 400 ms settling + 150 ms pause + 250 ms crossfade, six-second generation caption and live reduced-motion support. Other screens retain LoadingState.
- Rebuilt all student routes/states from the approved reference pack; subject variants share data-driven screens.
- Tokens, Lucide icons, exact SVG logo/glow, floating navigation, bottom sheets, forms and cards use v2 geometry.
- Bundled OFL Plus Jakarta Sans ExtraBold, Roboto Mono Regular/Medium/Bold and STIX Two Text Regular; linked iOS/Android.
- `react-native-svg` and `lucide-react-native` are explicitly approved exceptions to the old no-native-dependency rule; Material Symbols removed. `pod install` passed (88 pods).
- Shared-contract validation: lint (zero warnings/errors), TypeScript, Jest (35 suites / 240 tests), and diff whitespace checks pass. No simulator run for this task. Earlier UI v2 production JavaScript bundle passed.
- Native Release run on iPhone 17 Pro (iOS 26.4) verified outside the Codex sandbox with Maestro: sign-in, Mis cursos, Progreso, Historial, Perfil, Subtemas, Ejercicio, Resultado, Invitaciones (reject + empty state) match the v2 frames; Codex's sandbox cannot reach CoreSimulator.
- Follow-up fixes: cycle label uses enrollment `term`, falling back to `currentAcademicTerm()`; bell CountBadge hidden at 0; header transparent over BackgroundGlow; course focus clamped to 2 lines; relative dates (`Hoy, 10:45`); invitation date `14 nov`; profile fallback shows cycle instead of duplicating the role.
- Real local HTTP verification: specified student signed in/out, courses/progress/history/invitations/preferences read; both preference toggles persisted and original values restored.
- Real engine generated an exercise (33 seconds); answer recorded with explanation and mastery delta; ALL/CORRECT/INCORRECT history filters passed. This adds one real practice attempt.
- The specified account had no pending invitations; live acceptance/rejection and all simulator flows remain unverified. Automated flows cover both.
- Earlier QA: 23 native flows/140 DOCX screenshots belong to the previous UI, not v2; existing evidence files were not changed.

## Decisions
- Unfenced statement code is grouped as one region: lines between the first and last code-like line join the code block unless they are sentences (end in . ? ! : or start with ¿), so C++/CLI classes (`ref class`, `private:`) never alternate prose and code.
- Preserve screens -> hooks/useResource -> contract services -> one cookie-authenticated fetch client. No backend repositories or endpoint contracts changed.
- PracticeProvider owns five-exercise visits; replacement routes preserve outcomes and leaving practice/account changes reset them.
- Práctica exprés posts `{courseId, mode: "EXPRESS"}` for each of five exercises; the server selects/rotates subtopics. Sessions stay course-scoped and chips use response `subtopicId`.
- Guided calibration receives the already loaded subtopic/mastery through route params; continuation uses the answer response’s exact currentMastery. No additional requests or dependencies; missing difficulty bypasses the level reveal.
- Timer snapshots active seconds at submission, excluding generation/background/pauses and capped at 3600; POST includes `timeSpentSeconds`. History formats real seconds (`1m 42s`, including zero); only legacy null/missing values use `Sin registro`.
- Pull-to-refresh reloads student invitation count together with courses; badge reflects real counts including zero.
- No invented mastery: null stays unknown; Bajo <40, Medio 40-70 inclusive, Alto >70. Only mastery change uses points.
- Unavailable cycle uses `Ciclo actual`; missing photo uses initials; course continuation is a reinforcement recommendation from measured progress, not fabricated last-visit metadata.
- Known difficulty maps EASY/MEDIUM/HARD to level 1/2/3 and basic/intermediate/advanced; missing values use generic adaptive labels.
- Missing subtopic descriptions/hints/tips use neutral study guidance. No invented pending counts, solution steps or correct options.
- Result/history share numbered `explanationSteps` title/detail cards: TEXT prose, CODE existing editor, FORMULA STIX block; supplied `keyIdea` appears as `Idea clave`. Missing/empty steps retain legacy paragraphs/code/math without synthesizing reasoning.
- Answer comparison (Tu respuesta / Respuesta correcta) shows only for wrong answers, as in the Figma frames; correct answers avoid duplicated cards.
- Result/history resolve selected/correct option letters and text from API keys/options; correct answers are green and wrong selections red. Legacy fresh submissions can recover the selected text from the account-scoped exercise cache.
- Missing file/language metadata uses `Código`; missing formula domain uses `Expresión matemática`; remaining-time slot uses `Tiempo no estimado`.
- Invitations load PENDING and EXPIRED in parallel, deduplicate by ID with expired status winning, retain `courseId`, and prefer `teacherName` over email. Expired cards have resend guidance and no actions.
- Enrolled course metadata supplies term/faculty/semester and subtopic description when present; profile and cycle summary prefer API term. Date-derived cycle remains a fallback. Unsupported university count stays removed.
- Dark mode remains a saved preference (US-024 Won't), with the approved light palette. Reminder preference uses existing PATCH and preserves stored time; delivery is backend-owned and unverified.
- Native top safe area is preserved; floating TabBar uses the requested 16-point bottom inset.
- Arbitrary failures are normalized to safe Spanish retry-later copy; no internal exception messages reach screens.

## Pitfalls
- Credentials remain in memory only; never print/store them or read `api-keys.txt`.
- iOS 27 still needs UIScene; use iOS 26.x. Simulator access must be restored before native build/visual acceptance can be completed.
- Start the exercise timer only after calibration/crossfade finishes; keep motion static until AccessibilityInfo resolves, observe changes and stop loops/timeouts on cleanup.
- Jest resolves Lucide's CJS build; SVG runs through the React Native preset. Use pending-timer flushing with the exercise timer.
- Font filenames/PostScript names must match; run react-native-asset after changes. Font license files are bundled too.
- Reminder enabling needs dailyReminderTime (preserve existing or use contract default 20:00:00 UTC); preference-only toggles must not alter unrelated fields.
- Preserve previous academic/QA artifacts; temporary comparison/build outputs belong outside the repo and are removed before handoff.
