# Kalibra mobile UI integration audit

Audit date: 2026-10-10. **Both teammate branches do not comply and require refactoring before merge.** Type checking passes in both; authentication has one failing test, and both fail the authoritative frontend audit.

## Scope, references and evidence limits

Only this report was created. No source, worktree, memory, dependency, configuration or Git branch was modified. Checks used existing dependencies. Jest ran as `npx jest --no-cache` to avoid writing a test cache. No native build, simulator launch, package installation, merge or screenshot export was performed.

Path prefixes used in cross-branch citations:

- **A**: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-mobile-app__auth-profile`; `feature/auth-profile` at `5522b864b9560944d05f5d76fe97d30443e7b8e6`.
- **P**: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-mobile-app__progress-history`; `feature/progress-history` at `ab19f3da0066250e19b6b0f86cac7bd2c9b8ac09`.
- **I**: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/kalibra-mobile-app`; `docs/ui-integration-audit` and `feature/ui-integration` both at `c9168ffe188fd75b03817849f83fe568879f1a8e`.
- **D**: Git tree `develop` at `7fdcc6953cec4434f2c7b87e842af6eb48950809`.
- **F**: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma`. Wireflows and reuse inventory: `F/REFERENCE.md:18`, `:35`, `:43`, `:48`. Frame paths below resolve under `F/mobile/`.

Unprefixed file:line citations in each branch section resolve against that branch's worktree. Cross-branch citations explicitly use A/P/I/D. Audit-script inventory uses the same branch-relative paths.

Authoritative standard: `/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/SKILL.md`, with references `architecture-layered.md`, `conventions.md`, `styling.md`, `data-and-state.md`, `documentation.md`, `examples/tsdoc-examples.md`, `testing.md` and `audit.md` in its `references/` folder. Audit command: `python3 /Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/scripts/audit_frontend.py <worktree>`; repeated with `--json` to capture every hit.

All **17 supplied mobile PNGs were opened and inspected**. Design findings compare the actual reference images against source-determined markup, copy, styles, fixtures and reachable states. They are **not** pixel-diff measurements or screenshots of the running app. Platform rendering, exact measured spacing, responsive behavior at ~360/768/1280, screen-reader behavior, native build health and runtime iOS/Android behavior remain unverified. The commands requested prove lint/type/test/audit health, not a native build.

## Summary

| Branch | ESLint | TypeScript | Jest | Frontend audit | Overall verdict |
|---|---|---|---|---|---|
| feature/auth-profile | Exit 0; 0 errors, 8 warnings | Exit 0 | Exit 1; 1/4 suites failed, 1/9 tests failed | Exit 1; 3 error rules, 3 warning rules | **DOES NOT COMPLY / refactor before merge** |
| feature/progress-history | Exit 0; 0 errors, 6 warnings | Exit 0 | Exit 0; 4 suites, 9 tests passed | Exit 1; 3 error rules, 3 warning rules | **DOES NOT COMPLY / refactor before merge** |

Counts below count **finding rows**, grouped by category; `e/w` means error/warn. Inventories below give occurrence counts separately. Categories overlap in impact but each finding row is assigned one category.

| Branch | Error/warning finding count by category | Total |
|---|---|---|
| feature/auth-profile | build: 2e/1w; architecture: 1e/0w; styling: 2e/0w; primitives: 0e/1w; aliases: 1e/0w; documentation: 2e/2w; variants: 1e/0w; tests: 0e/1w; language: 1e/0w; accessibility: 0e/1w; redundancy: 1e/1w; integration: 2e/1w; flow: 1e/0w; data: 0e/1w; design: 11e/0w | 25 errors / 9 warnings |
| feature/progress-history | build: 1e/1w; architecture: 1e/0w; styling: 2e/0w; primitives: 0e/1w; aliases: 1e/0w; documentation: 2e/1w; variants: 1e/0w; tests: 0e/1w; accessibility: 0e/1w; redundancy: 1e/1w; integration: 3e/0w; flow: 4e/1w; behavior: 1e/0w; data: 2e/0w; design: 6e/0w | 25 errors / 7 warnings |

Automatic error occurrences: auth **124** (100 colors + 16 headers + 8 exports), progress **182** (143 colors + 17 headers + 22 exports). Automatic warning occurrences: auth **14**, progress **17**, including the **same six inherited missing READMEs**. These are not the script's `errors=3, warnings=3` totals, which count failing rules.

## feature/auth-profile

### Check results and exact failure diagnostics

| Executed command | Exit | Result |
|---|---|---|
| `npx eslint .` | 0 | Pass with 8 warnings; no error line |
| `npx tsc --noEmit` | 0 | Pass; no output/error line |
| `npx jest --no-cache` | 1 | First failing-suite line: `FAIL __tests__/App.test.tsx (8.661 s)` |
| Audit script | 1 | First error-rule line quoted below; terminal result `RESULT: FAIL (errors=3, warnings=3)` |

Exact first Jest assertion error line:

```text
    expect(received).toBeGreaterThanOrEqual(expected)
```

The assertion is `__tests__/App.test.tsx:20:74`, test `renders the main tabs`; expected >= 4, received 0. All other suites pass: utils, useResource and courses service. Total: 1 failed/8 passed tests.

Exact first audit error-rule line:

```text
| STYLE-01 | error | FAIL | 100 | no hex / rgb colors outside the tokens file |
```

Every ESLint diagnostic (file paths resolve under A):

| File:line:column | Exact warning line |
|---|---|
| `src/context/AuthContext.tsx:124:9` | `124:9  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/ProfileScreen.tsx:145:33` | `145:33  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/ProfileScreen.tsx:156:33` | `156:33  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/ProfileScreen.tsx:218:21` | `218:21  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/SignInScreen.tsx:148:33` | `148:33  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/SignInScreen.tsx:183:33` | `183:33  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/SignUpScreen.tsx:219:33` | `219:33  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/screens/SignUpScreen.tsx:225:33` | `225:33  warning  Expected 'undefined' and instead saw 'void'  no-void` |

### Findings

| ID | Severity | Category | File:line | Finding | Required fix |
|---|---|---|---|---|---|
| A01 | error | build | `__tests__/App.test.tsx:20` | Jest fails: the unchanged smoke test expects four tabs although the new signed-out root renders authentication (received 0). | Test signed-out SignIn first; authenticate explicitly before asserting tabs; unmount even after failures. |
| A02 | error | build | `src/components/auth/AuthAlert.tsx:21` | Audit exits 1: STYLE-01, DOC-02 and DOC-03 fail (100, 16 and 8 hits). | Resolve the full automatic inventory below and rerun the audit. |
| A03 | warn | build | `src/context/AuthContext.tsx:124` | ESLint exits 0 with eight no-void warnings; exact diagnostics are below. | Use project-compliant async event handling; do not hide diagnostics with new blanket suppressions. |
| A04 | error | architecture | `src/screens/SignInScreen.tsx:60`; `src/screens/SignUpScreen.tsx:82`; `src/screens/ProfileScreen.tsx:40` | Screens own submission/validation workflows and API-action try/catch; files are 334, 355 and 365 lines. Import boundaries pass, but composition-only screen rules do not. | Move validation and action/error normalization into hooks/pure validators; screens compose primitives and consume action state. |
| A05 | error | styling | `src/components/auth/AuthHeader.tsx:67`; `src/screens/SignInScreen.tsx:295`; `src/navigation/RootNavigator.tsx:67` | 100 hex/rgb-bearing lines bypass tokens. The primary #6C5CE7 is explicitly excluded by the design reference; text, borders and alerts introduce a separate palette. | Use existing colors, typography, fonts, spacing, radius and shadows; do not turn the incorrect palette into new tokens. |
| A06 | error | styling | `src/screens/SignInScreen.tsx:233`; `src/components/auth/AuthTextField.tsx:151`; `src/components/auth/AuthAlert.tsx:60` | At least 184 changed-source lines contain nonzero literal dimensions/typography outside ui/layout; feature components also create static palette style objects during render. STYLE-02/03 passing does not cover these RN forms. | Use tokens for screen/feature layout; move intrinsic control dimensions into ui/layout. Move static variants into typed module-level style maps; keep only computed runtime geometry inline. |
| A07 | warn | primitives | `src/screens/SignInScreen.tsx:152`; `src/screens/SignUpScreen.tsx:223`; `src/screens/ProfileScreen.tsx:170` | Six screen Pressables rebuild controls, including submit buttons already covered by Button. Native Text and character glyphs bypass Text/Icon. | Compose Button, Text, Icon and states; introduce generic missing controls in ui rather than styling raw controls in screens. |
| A08 | error | aliases | `src/screens/SignInScreen.tsx:20`; `src/components/auth/ProfileSummary.tsx:12`; `src/context/AuthContext.tsx:11` | 15 upward relative imports in changed source bypass @/; ProfileSummary climbs two levels. | Use @/ for cross-folder imports and component barrels; keep local sibling/barrel reexports where appropriate. |
| A09 | error | documentation | `src/components/auth/AuthAlert.tsx:2`; `src/mocks/auth.mock.ts:2`; `src/types/auth.ts:2` | All 16 new source files fail file-header coverage. Some have @packageDocumentation but none of these headers has @author. | Add canonical English module headers; resolve creator names from git, without guessing. |
| A10 | error | documentation | `src/context/AuthContext.tsx:46`; `src/hooks/useAuth.ts:6`; `src/services/auth.service.ts:116`; `src/types/auth.ts:19` | Eight exports lack TSDoc; additional docs omit canonical hook returns/throws/examples, service method contracts and domain-field descriptions. Header/export presence checks alone are insufficient. | Document every export/field and service method using the supplied canonical examples; document hooks with returns, fenced examples and applicable throws. |
| A11 | error | variants | `src/components/auth/AuthAlert.tsx:19`; `src/components/auth/AuthAlert.tsx:48`; `src/components/auth/AuthTextField.tsx:13`; `src/components/auth/index.ts:2` | Alert palettes are inferred objects and icons use nested ternaries instead of typed Record maps. Component props remain private (AuthTextField uses a type object), and the barrel exposes no props. | Export documented interface props and shared literal variants; use Record<Variant, ...> maps for palette/icon/style lookup and reexport props. |
| A12 | warn | tests | `src/hooks/useAuth.ts:14`; `src/hooks/useProfile.ts:15`; `src/context/AuthContext.tsx:72`; `src/services/auth.service.ts:115` | No feature tests were added. Existing four suites do not exercise auth/profile actions, context transitions, validation, visibility controls or logout. TEST-02 reports only two hook hits and misses this broader gap. | Add behavior tests per affected layer, including auth service, context, hooks, new interactive primitives and screen flows; isolate in-memory accounts/session between tests. |
| A13 | warn | documentation | `src/context/README.md:1` | Six existing layer directories lack README.md (components, hooks, services, utils, types, screens), inherited from develop. | Resolve as shared baseline documentation work; do not attribute these six omissions to this teammate alone. |
| A14 | error | language | `src/screens/ProfileScreen.tsx:105`; `src/components/auth/ProfileSummary.tsx:44` | Eight JSX comments are Spanish: ProfileScreen 105/116/125/131/163/208 and ProfileSummary 44/83. DOC-04 passes because its heuristic misses JSX comments. | Translate implementation comments to English; keep product-facing Spanish copy. |
| A15 | warn | accessibility | `src/screens/SignInScreen.tsx:95`; `src/screens/ProfileScreen.tsx:100`; `src/screens/SignInScreen.tsx:260` | Screens do not consume safe-area insets; SafeAreaProvider alone adds no padding. The remember-device row has minHeight 30 without hitSlop. | Reuse/adapt safe-area-aware layout and ensure all touch targets reach 44x44; verify keyboard/notch behavior on device. |
| A16 | error | redundancy | `src/components/auth/AuthHeader.tsx:27`; `src/components/auth/ProfileSummary.tsx:43`; `src/screens/ProfileScreen.tsx:71` | New native text, logo, cards, status indicators, buttons and feedback duplicate existing primitives/layout. Profile recreates loading/unavailable states; only ConfirmDialog is reused. | Reuse the existing inventory listed below; generalize the brand mark and statistic tile into shared ui/layout if needed. Preserve feature-specific profile composition. |
| A17 | warn | redundancy | `src/screens/SignUpScreen.tsx:37`; `src/services/auth.service.ts:72`; `src/services/auth.service.ts:57`; `src/components/auth/ProfileSummary.tsx:19` | Institutional-email validation is duplicated between screen/service; delay duplicates respond; formatting/initials live inside a rendering component. | Extract a pure tested validator/formatter only where shared; reuse respond for mocks and put the simulated contract implementation in mocks. |
| A18 | error | integration | `src/navigation/RootNavigator.tsx:28`; `src/navigation/RootNavigator.tsx:73` | Read-only merge-tree against ui-integration finds two conflict regions. The auth version registers placeholders for accepted course/practice screens and changes stack registration to a session guard. | Resolve from the accepted navigator, preserve all real feature imports, replace owned placeholders, and incorporate the signed-out/signed-in guard. |
| A19 | error | integration | `src/services/auth.service.ts:139`; `src/services/auth.service.ts:216`; `I/src/hooks/useMyCourses.ts:22`; `I/src/mocks/courses.mock.ts:59` | New accounts have zero profile statistics but course/student services still return fixed STUDENT/COURSES. Headers/greetings and course ownership can disagree with the authenticated profile. | Share student identity/session-aware course fixtures across auth, useCurrentStudent and useMyCourses; invalidate resource state on session changes. |
| A20 | warn | integration | `package-lock.json:12152`; `App.tsx:28` | Auth adds AuthProvider to App; omitting it during integration breaks useAuth. Lockfile changes only TypeScript metadata devOptional→dev; versions and package.json are unchanged. | Preserve AuthProvider around the accepted navigation; retain the integration lockfile unless the metadata change is intentionally required. No lockfile text conflict was found. |
| A21 | warn | documentation | `README.md:38`; `src/services/auth.service.ts:34` | The sign-in mock credential exists in source but README still documents only installation/scripts/scenarios, contrary to the entry-point decision. | Document only the explicitly local mock login in README; do not publish real secrets. |
| A22 | error | flow | `src/screens/SignUpScreen.tsx:165`; `src/screens/SignUpScreen.tsx:223`; `src/screens/SignUpScreen.tsx:250` | Duplicate-email state has only a dismissible alert, unchanged Crear cuenta CTA and generic footer navigation; no state-specific Usar otro correo action. Registration switches to a Courses placeholder, not empty Mis cursos 3.1. | Implement 1.2→2 and 1.2→1 actions; route successful registration to integrated Courses with an empty enrollment set. |
| A23 | warn | data | `src/context/AuthContext.tsx:223`; `src/services/auth.service.ts:53`; `src/services/auth.service.ts:184` | refreshProfile/action results are not guarded against later sign-out/session changes; preferences are one global in-memory object shared by accounts. Only startup restore has a mounted guard. | Scope mock preferences to accounts and ignore stale async results using session/request identity; preserve the existing startup cleanup. |
| A24 | error | design | `src/screens/SignUpScreen.tsx:159`; `src/components/auth/AuthHeader.tsx:27` | Frame 01: centered K brand and nested white form replace the portal hero, student strip and full-width independent fields. Missing access badge, personalized-plan callout, academic-security footer, field icons and exact helper/error copy; 24+20 horizontal padding narrows fields versus ~21-point Figma gutters. | Match 01_registro.png composition, copy, token colors, icons, Plus Jakarta Sans and field widths; move controls to shared primitives. |
| A25 | error | design | `src/components/auth/AuthTextField.tsx:93`; `src/screens/SignUpScreen.tsx:205` | Frame 01.1: password visibility works, but renders Mostrar/Ocultar text instead of the eye icon with active color; all frame-01 layout/copy differences persist. | Match 01.1_registro_contrasena_visible.png; retain typed text and toggle visibility with the Icon primitive. |
| A26 | error | design | `src/screens/SignUpScreen.tsx:165`; `src/screens/SignUpScreen.tsx:223` | Frame 01.2: email conflict appears at top of form instead of the inline red email notice; primary CTA remains Crear cuenta instead of Iniciar sesión with arrow. | Match 01.2_registro_correo_ya_registrado.png while supporting both recovery actions specified by the wireflow; wrap long notice copy without clipping. |
| A27 | error | design | `src/screens/SignInScreen.tsx:106`; `src/screens/SignInScreen.tsx:123`; `src/screens/SignInScreen.tsx:244` | Frame 02: Bienvenido de nuevo replaces ¡Hola de nuevo!; missing network badge, practice image/callout and Conexión segura. Alert title differs; email has no Revisa este dato/trailing error icon/error tint because no error prop is passed. White outer form and centered brand change layout. | Match 02_inicio_sesion.png, including Credenciales incorrectas notice, field feedback, arrow CTA, exact subtitle and font tokens. |
| A28 | error | design | `src/components/auth/AuthTextField.tsx:93`; `src/screens/SignInScreen.tsx:136` | Frame 02.1: visible-password state exists but uses a text control instead of the highlighted eye; frame-02 error-field and layout differences persist. | Match 02.1_inicio_sesion_contrasena_visible.png and preserve field content while toggling. |
| A29 | error | design | `src/screens/SignInScreen.tsx:116`; `src/screens/SignInScreen.tsx:123` | Frame 02.2: dismiss clears all shared/field errors; Figma retains the email warning/tint after removing only the alert. Remaining layout omits the practice card and network/security badges. | Match 02.2_inicio_sesion_aviso_descartado.png; maintain separate notice visibility and email validation state. |
| A30 | error | design | `src/screens/SignInScreen.tsx:116`; `src/components/auth/AuthTextField.tsx:107` | Frame 02.3: notice dismissal plus visible password cannot reproduce the retained email warning and active eye; same structural gaps as 02.2. | Match 02.3_aviso_descartado_contrasena_visible.png with independent notice, field-error and password-visibility states. |
| A31 | error | design | `src/screens/ProfileScreen.tsx:105`; `src/components/auth/ProfileSummary.tsx:44`; `src/screens/ProfileScreen.tsx:163` | Frame 09: missing brand/avatar AppHeader; Mi perfil/subtitle and Preferencias copy differ. Centered initials replace the photo-left identity card, student/verified badges and three icon statistic tiles. Extra Cuenta section/footer and white row replace the low centered soft logout button. | Match 09_perfil.png including Mi Perfil, Preferencias académicas, faculty/semester line, icon tiles and token spacing. Demo statistics 77/71%/3 already agree and should remain. |
| A32 | error | design | `src/screens/ProfileScreen.tsx:209`; `I/src/components/ui/ConfirmDialog.tsx:71` | Frame 09.1: dialog uses logout instead of power icon, different title/body and no confirm icon. Existing ConfirmDialog dims but does not blur the backdrop shown in the reference. | Match 09.1_confirmar_cierre_sesion.png copy/icons using ConfirmDialog props; handle any required blur as a deliberate shared dialog change. |
| A33 | error | design | `src/screens/ProfileScreen.tsx:138`; `src/components/auth/PreferenceRow.tsx:62` | Frame 09.2: toggle state is supported, but switch uses lavender track/purple thumb instead of solid primary track/white thumb, Unicode moon and different description. The frame remains light; a full dark palette is not demanded by this reference. | Match 09.2_modo_nocturno.png with Modo nocturno enabled and original profile layout/copy; toggling back restores 09. |
| A34 | error | design | `src/screens/ProfileScreen.tsx:149`; `src/components/auth/PreferenceRow.tsx:62` | Frame 09.3: reminder description never changes with state; reference requires Notificaciones desactivadas (enabled state: Notificaciones a las 19:00 hrs). Icon and switch styling also differ. | Match 09.3_recordatorios_desactivados.png with reminders off and state-specific copy; toggling back restores 09. |

### Frame coverage

The design rows identify concrete discrepancies for each individual frame; shared palette/font/layout discrepancies also apply to every owned frame.

| Frame image opened | Findings |
|---|---|
| `01_registro.png` | A24 |
| `01.1_registro_contrasena_visible.png` | A25 |
| `01.2_registro_correo_ya_registrado.png` | A26, A22 |
| `02_inicio_sesion.png` | A27 |
| `02.1_inicio_sesion_contrasena_visible.png` | A28 |
| `02.2_inicio_sesion_aviso_descartado.png` | A29 |
| `02.3_aviso_descartado_contrasena_visible.png` | A30 |
| `09_perfil.png` | A31 |
| `09.1_confirmar_cierre_sesion.png` | A32 |
| `09.2_modo_nocturno.png` | A33 |
| `09.3_recordatorios_desactivados.png` | A34 |

### Flow fidelity

| Required transition | Source evidence | Status |
|---|---|---|
| Fresh launch → SignIn 2.2 | `src/mocks/auth.mock.ts:82`; `src/navigation/RootNavigator.tsx:74` | Implemented via null session and conditional stack; target layout differs |
| SignIn ↔ SignUp | `src/screens/SignInScreen.tsx:87`; `src/screens/SignUpScreen.tsx:138` | Implemented |
| Registration 1 ↔ 1.1 visibility; invalid stays on 1 | `AuthTextField.tsx:49` under components/auth; `SignUpScreen.tsx:82` under screens | Implemented mechanism; copy/layout differ |
| Duplicate email → 1.2 → Iniciar sesión / Usar otro correo | `src/screens/SignUpScreen.tsx:165`, `:223`, `:250` | Partial: generic sign-in footer/dismiss exist, state-specific recovery/CTA missing |
| Registration success → Mis cursos empty 3.1 | `src/context/AuthContext.tsx:179`; `src/navigation/RootNavigator.tsx:28`; `I/src/mocks/courses.mock.ts:60` | Missing: placeholder standalone; demo enrollments after naive integration |
| Valid sign-in → Mis cursos 3 | `src/context/AuthContext.tsx:150`; `src/navigation/RootNavigator.tsx:76` | Auth transition implemented; accepted real courses must replace placeholder |
| Invalid credentials → 2 → dismiss → 2.2; password states 2.1/2.3 | `src/screens/SignInScreen.tsx:112`, `:116`; `src/components/auth/AuthTextField.tsx:93` | Mechanism exists; required retained field feedback missing |
| 9 ↔ 9.2; 9 ↔ 9.3 | `src/screens/ProfileScreen.tsx:138`, `:149`; `src/context/AuthContext.tsx:239` | Preference state updates implemented; reminder-state copy/switch visuals differ |
| 9 → logout 9.1 → Cancel → 9 / Confirm → 2.2 | `src/screens/ProfileScreen.tsx:174`, `:209`; `src/context/AuthContext.tsx:196` | Transitions implemented; modal copy/icons differ |
| Cursos/Progreso/Historial/Perfil | `src/navigation/RootNavigator.tsx:45` | Bottom bar retained; only Profile real in standalone auth branch |

### Refactor plan and acceptance criteria

1. [ ] **Resolve navigator integration without replacing accepted features.** Start from I, preserve MyCourses/CourseSubtopics/Invitations/EnrollmentConfirmed/Exercise/ExerciseResult, replace auth/profile placeholders, preserve AuthProvider and implement signed-out/signed-in stack registration. Acceptance: fresh launch shows SignIn, valid login shows Cursos, all four tabs work, logout removes authenticated history and returns SignIn, Android back cannot re-enter logged-out content.
2. [ ] **Unify account identity and mock ownership.** Connect course/student/profile fixtures to the same session and reset or invalidate session-bound hook data. Acceptance: a newly registered account enters empty Mis cursos 3.1 and has zero statistics; the existing demo has its correct course set and 77/71%/3; logging out and into another account does not show the previous account's name/preferences/course data. No unrelated real backend work is required.
3. [ ] **Replace duplicated presentation and relocate intrinsic dimensions.** Reuse ui/layout building blocks, add generic TextField/Checkbox/Toggle/Callout only where missing, export props/maps and move form use cases into hooks. Acceptance: no screens import services/mocks, no components import services/context/data hooks; zero upward relative imports; no literal colors or arbitrary feature/screen dimensions; dynamic inline geometry only.
4. [ ] **Match every auth frame.** Acceptance: all seven files `01`, `01.1`, `01.2`, `02`, `02.1`, `02.2`, `02.3` listed above match reference composition/copy/icons/colors/states at 393×852. Registration visibility preserves data; invalid email/password stays on registration with inline feedback; duplicate email supports both recovery actions; valid login reaches 3; invalid login reaches 2; dismiss removes only the notice; visibility works before/after dismissal.
5. [ ] **Match profile and logout frames.** Acceptance: `09`, `09.1`, `09.2`, `09.3` match the four PNGs; toggles return to original states, reminders update exact state copy, Cancel restores profile, confirmation reaches 2.2. Test device safe areas, keyboard and target sizes. Do not impose a dark palette that the supplied 09.2 frame does not show.
6. [ ] **Complete documentation and focused tests.** Acceptance: canonical file/export/field/service TSDoc in English with git authors; remove Spanish implementation comments; document local mock login and scenarios; resolve shared missing READMEs. Add service/context/hook/interactive primitive/screen flow tests. Update App smoke and integrated flow setup to authenticate explicitly.
7. [ ] **Run final gates on the integrated result.** Acceptance: `npx eslint .` has no errors or newly introduced warnings; `npx tsc --noEmit` passes; `npx jest` passes including auth and existing student flows; the audit exits 0 with no error rule failing (resolve inherited warnings as shared work). Record iOS/Android launches and reference-state screenshots, including small/tablet widths, before visual sign-off.

### Automatic rule results

| Rule | Severity | Result | Hits |
|---|---|---|---|
| ARCH-01 | error | pass | 0 |
| ARCH-02 | error | pass | 0 |
| ARCH-03 | error | pass | 0 |
| ARCH-04 | error | pass | 0 |
| ARCH-05 | warn | FAIL | 6 |
| DATA-01 | error | pass | 0 |
| STYLE-01 | error | FAIL | 100 |
| STYLE-02 | error | pass | 0 |
| STYLE-03 | warn | pass | 0 |
| STYLE-04 | error | pass | 0 |
| STYLE-05 | warn | pass | 0 |
| STYLE-06 | error | pass | 0 |
| TS-01 | error | pass | 0 |
| TS-02 | warn | pass | 0 |
| CONV-01 | warn | pass | 0 |
| CONV-02 | warn | pass | 0 |
| CONV-03 | warn | FAIL | 6 |
| DOC-01 | error | pass | 0 |
| DOC-02 | error | FAIL | 16 |
| DOC-03 | error | FAIL | 8 |
| DOC-04 | warn | pass | 0 |
| TEST-01 | error | pass | 0 |
| TEST-02 | warn | FAIL | 2 |
| SEC-01 | error | pass | 0 |

Manual checklist: import boundaries/no any/services independent of React pass in inspected changes; composition/tokens/primitives/docs/tests fail as cited. English identifiers are generally preserved; JSX comments violate the language rule. Accessibility/responsive/native execution are not signed off.

### Complete automatic failure inventory

These are script hits, not additional independent finding IDs. Color hits count matching source **lines**, not unique colors. Header omissions are cited at line 1 (file start). Layer README omissions are inherited; the absent files have no line number.

**ARCH-05 (warn; 6 hits)**

- `src/components/README.md missing`
- `src/hooks/README.md missing`
- `src/services/README.md missing`
- `src/utils/README.md missing`
- `src/types/README.md missing`
- `src/screens/README.md missing`

**STYLE-01 (error; 100 hits)**

- `src/components/auth/AuthAlert.tsx`: lines 21, 22, 23, 24, 27, 28, 29, 30, 33, 34, 35, 36, 144.
- `src/components/auth/AuthHeader.tsx`: lines 67, 74, 80, 87, 95.
- `src/components/auth/AuthTextField.tsx`: lines 78, 144, 154, 156, 162, 167, 168, 172, 180, 191, 208, 209, 218, 224.
- `src/components/auth/PreferenceRow.tsx`: lines 67, 68, 71, 73, 97, 104, 111, 122, 128.
- `src/components/auth/ProfileSummary.tsx`: lines 126, 132, 143, 150, 156, 163, 179, 184, 194, 203, 210, 219.
- `src/navigation/RootNavigator.tsx`: lines 67, 98.
- `src/screens/ProfileScreen.tsx`: lines 76, 229, 240, 248, 253, 260, 270, 277, 287, 294, 296, 303, 305, 319, 326, 333, 343, 349, 355, 361.
- `src/screens/SignInScreen.tsx`: lines 195, 228, 246, 252, 268, 269, 276, 277, 281, 288, 295, 302, 310, 325, 330.
- `src/screens/SignUpScreen.tsx`: lines 237, 276, 294, 300, 306, 314, 322, 337, 342, 350.

**CONV-03 (warn; 6 hits)**

- `src/screens/ProfileScreen.tsx:170  <Pressable>`
- `src/screens/SignInScreen.tsx:152  <Pressable>`
- `src/screens/SignInScreen.tsx:181  <Pressable>`
- `src/screens/SignInScreen.tsx:208  <Pressable>`
- `src/screens/SignUpScreen.tsx:223  <Pressable>`
- `src/screens/SignUpScreen.tsx:250  <Pressable>`

**DOC-02 (error; 16 hits)**

- `src/components/auth/AuthAlert.tsx:1`
- `src/components/auth/AuthHeader.tsx:1`
- `src/components/auth/AuthTextField.tsx:1`
- `src/components/auth/PreferenceRow.tsx:1`
- `src/components/auth/ProfileSummary.tsx:1`
- `src/components/auth/index.ts:1`
- `src/context/AuthContext.tsx:1`
- `src/hooks/useAuth.ts:1`
- `src/hooks/useProfile.ts:1`
- `src/mocks/auth.mock.ts:1`
- `src/screens/ProfileScreen.tsx:1`
- `src/screens/SignInScreen.tsx:1`
- `src/screens/SignUpScreen.tsx:1`
- `src/services/auth.contract.ts:1`
- `src/services/auth.service.ts:1`
- `src/types/auth.ts:1`

**DOC-03 (error; 8 hits)**

- `src/components/auth/AuthAlert.tsx:40  AuthAlert`
- `src/components/auth/AuthTextField.tsx:33  AuthTextField`
- `src/components/auth/ProfileSummary.tsx:38  ProfileSummary`
- `src/context/AuthContext.tsx:46  AuthContext`
- `src/context/AuthContext.tsx:72  AuthProvider`
- `src/screens/ProfileScreen.tsx:22  ProfileScreen`
- `src/screens/SignInScreen.tsx:31  SignInScreen`
- `src/screens/SignUpScreen.tsx:40  SignUpScreen`

**TEST-02 (warn; 2 hits)**

- `src/hooks/useAuth.ts`
- `src/hooks/useProfile.ts`

### Manual inventory missed by the script

STYLE-02 only matches Tailwind bracket values; STYLE-03 only matches `style={{` and misses style arrays. DOC-04 misses the Spanish JSX comments listed in A14. TEST-02 uses substring matching and is not proof of behavior coverage. The following lists upward imports and a conservative inventory of nonzero literal RN style measurements in changed source; it excludes structural `flex: 1`, zero offsets and computed percentages. It is not a count of unique dimensions.

| File | Upward import lines | Literal measurement/typography lines |
|---|---|---|
| `src/components/auth/AuthAlert.tsx` | — | 126, 127, 128, 129, 130, 134, 135, 136, 139, 140, 145, 155, 157, 161, 162, 166, 167, 170, 174, 176 |
| `src/components/auth/AuthHeader.tsx` | — | 55, 60, 64, 65, 66, 70, 75, 81, 83, 88, 91, 96, 97, 99 |
| `src/components/auth/AuthTextField.tsx` | — | 140, 145, 147, 151, 155, 157, 158, 163, 179, 181, 185, 186, 192, 199, 200, 204, 205, 207, 211, 213, 219, 220, 225, 226, 227 |
| `src/components/auth/PreferenceRow.tsx` | — | 90, 91, 92, 96, 101, 102, 103, 107, 112, 118, 123, 129, 130, 131, 135 |
| `src/components/auth/ProfileSummary.tsx` | 12 | 127, 128, 129, 130, 131, 140, 141, 142, 146, 151, 157, 164, 165, 174, 175, 180, 185, 191, 192, 193, 204, 206, 211, 212, 217, 218 |
| `src/context/AuthContext.tsx` | 11, 21 | — |
| `src/hooks/useAuth.ts` | 4 | — |
| `src/hooks/useProfile.ts` | 9 | — |
| `src/screens/ProfileScreen.tsx` | 16, 18, 19, 20 | 233, 234, 235, 243, 247, 249, 254, 259, 261, 266, 271, 276, 278, 279, 283, 288, 290, 295, 297, 298, 299, 304, 306, 313, 314, 315, 323, 324, 325, 329, 334, 344, 350, 351, 356, 360, 362 |
| `src/screens/SignInScreen.tsx` | 20, 22, 24 | 233, 234, 240, 247, 248, 249, 250, 251, 259, 260, 264, 265, 266, 267, 272, 282, 284, 289, 293, 294, 298, 311, 320, 321, 326, 331 |
| `src/screens/SignUpScreen.tsx` | 20, 22, 24 | 281, 282, 288, 295, 296, 297, 298, 299, 304, 305, 309, 310, 323, 332, 333, 338, 343, 348, 349, 351, 352 |


## feature/progress-history

### Check results and exact failure diagnostics

| Executed command | Exit | Result |
|---|---|---|
| `npx eslint .` | 0 | Pass with 6 warnings; no error line |
| `npx tsc --noEmit` | 0 | Pass; no output/error line |
| `npx jest --no-cache` | 0 | 4 suites, 9 tests passed; no error line |
| Audit script | 1 | First error-rule line below; terminal result `RESULT: FAIL (errors=3, warnings=3)` |

Passing Jest suites: `src/services/courses.service.test.ts`, `src/utils/utils.test.ts`, `src/hooks/useResource.test.tsx`, `__tests__/App.test.tsx`. They do not exercise the new progress/history feature.

Exact first audit error-rule line:

```text
| STYLE-01 | error | FAIL | 143 | no hex / rgb colors outside the tokens file |
```

Every ESLint diagnostic (paths resolve under P):

| File:line:column | Exact warning headline |
|---|---|
| `src/components/progress/MasteryRing.tsx:89:21` | `89:21  warning  Inline style: { left: 0 }   react-native/no-inline-styles` |
| `src/components/progress/MasteryRing.tsx:119:21` | `119:21  warning  Inline style: { right: 0 }  react-native/no-inline-styles` |
| `src/components/progress/SubtopicProgressCard.tsx:111:25` | `111:25  warning  Inline style: {` (`react-native/no-inline-styles`; backgroundColor conditional) |
| `src/components/progress/SubtopicProgressCard.tsx:128:29` | `128:29  warning  Inline style: {` (`react-native/no-inline-styles`; color conditional) |
| `src/hooks/usePracticeHistory.ts:139:9` | `139:9  warning  Expected 'undefined' and instead saw 'void'  no-void` |
| `src/hooks/useProgress.ts:124:9` | `124:9  warning  Expected 'undefined' and instead saw 'void'  no-void` |

The two multiline inline-style warnings identify these original expressions: backgroundColor chooses `#F2EFFF`/`#F3F4F8`; color chooses `#6C5CE7`/`#747B90`.

### Findings

| ID | Severity | Category | File:line | Finding | Required fix |
|---|---|---|---|---|---|
| P01 | error | build | `src/components/progress/CourseSelector.tsx:168` | Audit exits 1: STYLE-01, DOC-02 and DOC-03 fail (143, 17 and 22 hits). | Resolve the complete automatic inventory and rerun. |
| P02 | warn | build | `src/components/progress/MasteryRing.tsx:89` | ESLint exits 0 with six warnings: four no-inline-styles and two no-void diagnostics. | Resolve the exact diagnostics below, preserving computed runtime geometry. |
| P03 | error | architecture | `src/screens/ProgressScreen.tsx:12`; `src/screens/ProgressScreen.tsx:13`; `src/screens/ProgressScreen.tsx:89` | ProgressScreen imports COURSES and MOCK_PROGRESS_COURSE_ID directly from mocks. ARCH-01 passes because the script checks service imports, not mock imports. It is 390 lines. | Get courses/selection/defaults through a feature hook and service; screens compose presentation and never know fixtures. |
| P04 | error | styling | `src/components/progress/WeakSubtopicCard.tsx:136`; `src/screens/ProgressScreen.tsx:215`; `src/components/progress/HistoryFilters.tsx:163` | 143 hex/rgb-bearing lines bypass tokens; primary #6C5CE7, gray background #F7F8FC, green/orange statuses and translucent palettes diverge from the design tokens. | Use the existing primary/surface/success/warning/danger palette, typography and fonts. |
| P05 | error | styling | `src/screens/ProgressScreen.tsx:220`; `src/components/progress/ProgressOverview.tsx:54`; `src/components/progress/SubtopicProgressCard.tsx:111` | At least 268 changed-source lines contain nonzero literal style dimensions/typography outside ui/layout; static inline palettes and ring size=164/strokeWidth=13 occur in feature code. Passing STYLE-02/03 does not validate these RN expressions. | Use tokens and shared primitives; restrict intrinsic geometry to ui/layout and computed percentages/rotations to dynamic styles. |
| P06 | warn | primitives | `src/screens/ProgressScreen.tsx:116`; `src/screens/HistoryScreen.tsx:87` | Seven screen Pressables plus raw native Text/glyphs rebuild feedback/buttons instead of existing primitives. | Use Button/Text/Icon and LoadingState/ErrorState/EmptyState; use shared controls for selectors/filters. |
| P07 | error | aliases | `src/screens/ProgressScreen.tsx:12`; `src/components/progress/CourseSelector.tsx:23`; `src/services/progress.service.ts:17` | 24 upward relative imports in changed source bypass @/; component imports climb two levels, and ProgressScreen imports component files instead of their barrel. | Use @/ for cross-layer/cross-folder imports and the component barrel. |
| P08 | error | documentation | `src/components/progress/CourseSelector.tsx:2`; `src/types/progress.ts:2` | All 17 new source files fail module-header coverage (many have @packageDocumentation without @author). | Add canonical English file headers using git-resolved creator names. |
| P09 | error | documentation | `src/mocks/progress.mock.ts:34`; `src/screens/HistoryScreen.tsx:24`; `src/hooks/useProgress.ts:37`; `src/types/progress.ts:94` | 22 exports lack TSDoc; other hooks/services/fields omit returns/examples/parameters/error contracts required by the canonical forms. | Document the inventory and all domain fields/methods; do not treat audit presence checks as full documentation quality validation. |
| P10 | error | variants | `src/mocks/progress.mock.ts:86`; `src/components/progress/SubtopicProgressCard.tsx:31`; `src/components/progress/HistoryExerciseCard.tsx:47`; `src/components/progress/index.ts:2` | Level/icon/color variants are branching functions/ternaries, not typed Record maps. Props interfaces are private and the barrel exports components only. | Use documented literal variants with Record<Variant, ViewStyle/TextStyle/palette/label> maps; export interface props and their barrel reexports. |
| P11 | warn | tests | `src/hooks/useProgress.ts:42`; `src/hooks/usePracticeHistory.ts:49`; `src/services/progress.service.ts:48` | All four passing suites are inherited from develop; no progress/history tests exist. TEST-02 emits four hits (one is a type-only contract, which does not itself need a runtime test). | Test service behavior, hooks loading/error/stale responses, ring states, filters, callbacks and all required screen transitions; do not add meaningless tests for interfaces. |
| P12 | warn | documentation | `src/context/README.md:1` | Six baseline layer README omissions are inherited from develop. | Resolve in shared baseline documentation work. |
| P13 | warn | accessibility | `src/screens/ProgressScreen.tsx:58`; `src/screens/HistoryScreen.tsx:46`; `src/components/progress/CourseSelector.tsx:100` | No safe-area-aware header/shell is used. History back, previews and retry controls omit roles; icon-only back has no label, selector close has no explicit 44-point target/hitSlop. | Reuse layout and shared controls; add valid roles, labels/states and minimum targets, then verify on iOS/Android. |
| P14 | error | redundancy | `src/components/progress/SubtopicProgressCard.tsx:95`; `src/components/progress/WeakSubtopicCard.tsx:89`; `src/components/progress/HistoryFilters.tsx:50`; `src/screens/HistoryScreen.tsx:113` | Cards, linear bars, statuses, buttons, empty/loading/error states and glyph icons recreate develop primitives; mastery summaries overlap accepted course-feature presentation. | Reuse primitives and generalize shared statistics/mastery/selector pieces into ui rather than importing another feature folder. |
| P15 | warn | redundancy | `src/hooks/useProgress.ts:89`; `src/hooks/usePracticeHistory.ts:102`; `src/services/progress.service.ts:38`; `src/components/progress/SubtopicProgressCard.tsx:36`; `src/types/progress.ts:159` | Two hooks duplicate useResource's loader lifecycle, simulateRequest duplicates respond, local 75/50 mastery thresholds disagree with existing masteryTone 70/40, and ProgressLoadingState repeats generic loading state. | Keep feature selection/filter state but reuse useResource/respond; share masteryTone and typed presentation maps. Remove unused generic state/constants after checking consumers. |
| P16 | error | integration | `src/navigation/RootNavigator.tsx:21`; `src/navigation/RootNavigator.tsx:58` | Read-only merge-tree against ui-integration finds one conflict region. The branch retains accepted course/practice placeholders and initialRouteName=Tabs. | Resolve from accepted navigation; keep real course/practice registrations, add owned tabs and honor sign-in entry/session guard. |
| P17 | error | integration | `src/types/progress.ts:94`; `src/components/progress/HistoryExerciseCard.tsx:133`; `src/mocks/progress.mock.ts:163`; `I/src/navigation/types.ts:32` | History exposes exerciseId only to its callback, uses unrelated exercise-1/attempt-1 fixtures, and lacks a usable attemptId contract. Accepted results require attemptId, not the develop exerciseId/optionId pair. | Add a recorded attempt identifier, align fixtures/results, and navigate to ExerciseResult with that identifier; preserve the accepted route type. |
| P18 | error | integration | `src/hooks/useProgress.ts:57`; `src/hooks/usePracticeHistory.ts:70`; `src/mocks/progress.mock.ts:50`; `src/services/progress.service.ts:91` | Local preview flags/explicit empty endpoints ignore shared isEmptyScenario and auth identity; directly reading COURSES exposes demo enrollments even if course services return none. | Use one session-aware mock scenario/data source; derive empty behavior from service data, with preview controls layered on the same fixture choice. |
| P19 | error | flow | `src/navigation/RootNavigator.tsx:22`; `src/screens/ProgressScreen.tsx:137` | 7→5 reinforcement is unavailable: ProgressTab never supplies onPractice, so WeakSubtopicCard is disabled. | Connect typed root navigation to Exercise with selected course and recommended subtopic (default course-1/sub-3). |
| P20 | error | flow | `src/screens/ProgressScreen.tsx:158` | 7.1→5 is missing: empty progress has no Empezar a practicar action; it still renders the empty overview plus another card. | Use one EmptyState with a working Exercise route for an eligible subtopic; define the no-course/no-subtopic fallback explicitly. |
| P21 | error | flow | `src/navigation/RootNavigator.tsx:23`; `src/screens/HistoryScreen.tsx:109`; `src/components/progress/HistoryExerciseCard.tsx:131` | 8/8.2/8.3→6 is missing: HistoryTab supplies no onOpenExercise, so the breakdown action is not rendered. | Connect every visible completed attempt to ExerciseResult{attemptId}, including incorrect attempts; opening history must not submit an answer again. |
| P22 | error | flow | `src/screens/HistoryScreen.tsx:112` | 8.1→5 is missing: empty history has no Resolver mi primer ejercicio button. | Add the required EmptyState CTA connected to Exercise with valid course/subtopic. |
| P23 | warn | flow | `src/navigation/RootNavigator.tsx:23`; `src/screens/HistoryScreen.tsx:46` | History adds an unrequested back arrow which always navigates to Progress even when entered directly from the bottom bar; Figma uses the common brand/avatar header. | Use the tab shell without this synthetic back action; retain Cursos/Progreso/Historial/Perfil navigation. |
| P24 | error | behavior | `src/components/progress/MasteryRing.tsx:99`; `src/components/progress/MasteryRing.tsx:128`; `src/components/progress/MasteryRing.tsx:199` | Each progress half has a solid border on all sides; rotating a complete circle cannot represent an arc. With both clipped halves, the primary ring remains full even at 0/null (source-determined, not a captured native rendering). | Implement actual percentage geometry in a shared ui primitive; verify null, 0, 33, 62, 100 and out-of-range values. |
| P25 | error | data | `src/mocks/progress.mock.ts:128` | Every course gets nine exercises and a memoization-specific recommendation; Figma course-1/sub-3 requires three. Applying this copy to vector/calculus subtopics is incorrect. | Use data-driven, subtopic-appropriate recommendation fixtures; default urgent fixture must match 3 guided exercises. |
| P26 | error | data | `src/mocks/progress.mock.ts:36`; `src/mocks/progress.mock.ts:64` | Exercise counts exist only for sub-1..sub-4; other courses retain non-null mastery/isPracticed but default counts to 0/0, yielding internally inconsistent breakdowns. | Provide consistent per-subtopic fixture counts or model missing count data explicitly; do not display practiced 0/0 as a real statistic. |
| P27 | error | design | `src/screens/ProgressScreen.tsx:58`; `src/components/progress/ProgressOverview.tsx:39`; `src/components/progress/WeakSubtopicCard.tsx:58`; `src/components/progress/SubtopicProgressCard.tsx:65` | Frame 07: missing AppHeader, PANEL ANALÍTICO, Mi Progreso Académico and matching Ver vista inicial control. Selector lacks icon/Curso Activo surface. Overview is centered/large rather than compact text-left 62% global-right. Urgent card is purple instead of warning peach, has wrong title/action/9 count. Breakdown lacks icons, Nivel Alto copy/4 unidades, and lists recursion before trees. | Match 07_mi_progreso.png: compact overview, warning card with 33%/3/Reforzar ahora, Desglose por Subtemas and first rows Árboles 81% then Recursividad 72%, with token spacing and glyphs. |
| P28 | error | design | `src/screens/ProgressScreen.tsx:127`; `src/screens/ProgressScreen.tsx:158`; `src/components/progress/ProgressOverview.tsx:94` | Frame 07.1: empty overview/ring/statistics plus Tu progreso comienza aquí card replace the single illustrated Aún no estimamos tu dominio card; exact explanatory copy and tonal Empezar a practicar CTA are absent. | Match 07.1_mi_progreso_estado_inicial.png with brand header, active-course selector and one empty card. |
| P29 | error | design | `src/screens/HistoryScreen.tsx:51`; `src/components/progress/HistorySummary.tsx:46`; `src/components/progress/HistoryExerciseCard.tsx:57` | Frame 08: Mi historial/subtitle/back arrow replace Historial de Práctica and header. Four tall statistics tiles replace the slim Tasa de aciertos/74% aciertos row. Cards reorder subtopic/title, add dividers/labeled columns, use Repasar/orange rather than Incorrecto/red, omit Pendiente and breakdown text, use calendar-only dates/m:ss durations rather than relative date/time/1m 42s. Filter count colors differ. | Match 08_historial.png: slim summary, colored counts 42/31/11, correct/incorrect badges and reference card hierarchy, metadata/icons and actions; handle unknown duration without invented 0:00. |
| P30 | error | design | `src/screens/HistoryScreen.tsx:93`; `src/screens/HistoryScreen.tsx:117` | Frame 08.1: empty history still shows summary/filter controls and Aún no tienes prácticas with a diamond; reference shows only the illustrated Todavía no tienes historial card and exact CTA/copy. | Match 08.1_historial_vacio.png and omit populated-only summary/filter/recommendation. |
| P31 | error | design | `src/screens/HistoryScreen.tsx:130`; `src/screens/HistoryScreen.tsx:59`; `src/components/progress/HistoryFilters.tsx:75` | Frame 08.2: correct filtering is implemented, but recommended advice is displayed as JSON.stringify(object) under Recomendación, not a bulb-led Consejo de práctica espaciada card. Preview sits above content with different copy; two correct cards retain frame-08 structural gaps; unselected Para repasar count has no danger tint. | Match 08.2_historial_filtro_correctos.png: two correct records, 74%, reference advice card and bottom Simulación de estados/Previsualizar historial vacío control. |
| P32 | error | design | `src/components/progress/HistoryExerciseCard.tsx:102`; `src/screens/HistoryScreen.tsx:136` | Frame 08.3: review filter selects the pending item, but card says Repasar with orange tone and omits Pendiente; advice is JSON and preview location/copy differs. Timestamp fixture describes the same day as the first item instead of Ayer. | Match 08.3_historial_filtro_para_repasar.png: one Incorrecto/red/Pendiente card, correct relative date/time, formatted advice and bottom preview. |

### Frame coverage

| Frame image opened | Findings |
|---|---|
| `07_mi_progreso.png` | P24, P25, P27 |
| `07.1_mi_progreso_estado_inicial.png` | P20, P28 |
| `08_historial.png` | P21, P29 |
| `08.1_historial_vacio.png` | P22, P30 |
| `08.2_historial_filtro_correctos.png` | P21, P31 |
| `08.3_historial_filtro_para_repasar.png` | P21, P32 |

### Flow fidelity

| Required transition | Source evidence | Status |
|---|---|---|
| Tabs Cursos/Progreso/Historial/Perfil | `src/navigation/RootNavigator.tsx:41` | Bar retained; only Progress/History real in standalone branch |
| 7 → Reforzar ahora → Exercise 5 for recommended subtopic | `src/navigation/RootNavigator.tsx:22`; `src/screens/ProgressScreen.tsx:137` | Missing; callback not wired and action disabled |
| 7.1 → Empezar a practicar → Exercise 5 | `src/screens/ProgressScreen.tsx:158` | Missing action |
| 8 → Correctos 8.2 / Para repasar 8.3 / Todos 8 | `src/components/progress/HistoryFilters.tsx:52`; `src/hooks/usePracticeHistory.ts:80`; `src/mocks/progress.mock.ts:264` | Implemented filters; demo yields 3/2/1 visible records, with aggregate counts 42/31/11 |
| 8 / 8.2 / 8.3 → Ver desglose → result 6 | `src/navigation/RootNavigator.tsx:23`; `src/components/progress/HistoryExerciseCard.tsx:131` | Missing callback/action; identifier contract also wrong |
| 8.1 → Resolver mi primer ejercicio → Exercise 5 | `src/screens/HistoryScreen.tsx:112` | Missing action |
| Fresh launch → SignIn | `src/navigation/RootNavigator.tsx:58` | Wrong entry (Tabs); inherited assumption must be resolved with auth integration |
| History entered directly from tab | `src/navigation/RootNavigator.tsx:23` | Extra back arrow always goes to Progress, absent from reference |

### Refactor plan and acceptance criteria

1. [ ] **Preserve accepted root routes and connect tab actions.** Acceptance: root honors SignIn entry; Progress/History coexist with real Courses/Profile; all four tabs work; no accepted course/invitation/practice transition is replaced by a placeholder.
2. [ ] **Use hooks/services for all data and one account/scenario source.** Acceptance: no screen imports mocks/services; selection receives enrolled courses through a hook; default course may be course-1 as fixture data without hardcoding it in screen code. New accounts/no courses cannot see demo enrollments. Empty and populated states agree across Courses, Profile, Progress and History.
3. [ ] **Unify result identifiers.** Acceptance: every history item maps to a stored/mock-supported `attemptId`; `ExerciseResult` retains I's `{attemptId}`; opening any correct or incorrect history item displays its matching result and does not invoke submitAnswer again. Do not fabricate a result for an unrelated fixture title.
4. [ ] **Reuse primitives and fix mastery visualization/data.** Acceptance: shared linear bars, cards, feedback, text/icons and filter controls use tokens; ring geometry correctly displays null/0/33/62/100; 70/40 mastery thresholds are shared unless a documented design rule requires otherwise. Each selected course has coherent counts/mastery and subtopic-specific recommendation text; default urgent fixture is Programación Dinámica, 33%, three guided exercises.
5. [ ] **Match both Progress frames and their actions.** Acceptance: `07_mi_progreso.png` and `07.1_mi_progreso_estado_inicial.png` at 393×852 match brand shell, active selector, copy and card ordering. 7→Reforzar ahora→Exercise(`course-1`, `sub-3`) works; 7.1→Empezar a practicar→Exercise with valid eligible IDs works. Where enrollment/subtopics are absent, provide a documented valid fallback without bogus Exercise params.
6. [ ] **Match all four History frames and transitions.** Acceptance: `08_historial.png`, `08.1_historial_vacio.png`, `08.2_historial_filtro_correctos.png`, `08.3_historial_filtro_para_repasar.png` match the slim 74% row, counts 42/31/11, cards, dates/times, status/Pendiente chips, formatted advice and preview position/copy. Todos→Correctos→Todos and Todos→Para repasar→Todos work; every populated card opens result 6; empty-history CTA opens Exercise 5. Empty frame omits populated summary/filter UI.
7. [ ] **Complete documentation, export APIs and tests.** Acceptance: canonical English TSDoc with git authors on all files/exports/fields; typed Record maps and exported props/barrels; no upward imports; test service filters, hooks state/stale results, ring, selector, filters, empty/error states and navigation callbacks. Keep aggregate Figma counters documented; do not demand 42 individual mock records when only three sample records were supplied.
8. [ ] **Run final integrated gates and native visual checks.** Acceptance: ESLint no errors/new warnings, TypeScript pass, Jest all existing/new suites pass and authoritative audit exit 0. Verify device safe areas/accessibility/touch targets and small/tablet widths; capture all six exact states on iOS/Android before visual sign-off.

### Automatic rule results

| Rule | Severity | Result | Hits |
|---|---|---|---|
| ARCH-01 | error | pass | 0 |
| ARCH-02 | error | pass | 0 |
| ARCH-03 | error | pass | 0 |
| ARCH-04 | error | pass | 0 |
| ARCH-05 | warn | FAIL | 6 |
| DATA-01 | error | pass | 0 |
| STYLE-01 | error | FAIL | 143 |
| STYLE-02 | error | pass | 0 |
| STYLE-03 | warn | pass | 0 |
| STYLE-04 | error | pass | 0 |
| STYLE-05 | warn | pass | 0 |
| STYLE-06 | error | pass | 0 |
| TS-01 | error | pass | 0 |
| TS-02 | warn | pass | 0 |
| CONV-01 | warn | pass | 0 |
| CONV-02 | warn | pass | 0 |
| CONV-03 | warn | FAIL | 7 |
| DOC-01 | error | pass | 0 |
| DOC-02 | error | FAIL | 17 |
| DOC-03 | error | FAIL | 22 |
| DOC-04 | warn | pass | 0 |
| TEST-01 | error | pass | 0 |
| TEST-02 | warn | FAIL | 4 |
| SEC-01 | error | pass | 0 |

Manual checklist: screen→mock boundary fails despite ARCH-01 pass; components do not import services/context; services do not import React; no any was detected. Source identifiers/comments are English in inspected new progress files. Tokens/primitives/docs/tests fail as cited. Async hooks ignore stale effect responses using active guards but do not cancel simulated timers; this is not a claim that they perform HTTP requests. Responsive/accessibility/native execution remain unverified.

### Complete automatic failure inventory

These are script hits, not additional independent finding IDs. Color hits count matching source **lines**, not unique colors. Header omissions are cited at line 1 (file start). Layer README omissions are inherited; the absent files have no line number.

**ARCH-05 (warn; 6 hits)**

- `src/components/README.md missing`
- `src/hooks/README.md missing`
- `src/services/README.md missing`
- `src/utils/README.md missing`
- `src/types/README.md missing`
- `src/screens/README.md missing`

**STYLE-01 (error; 143 hits)**

- `src/components/progress/CourseSelector.tsx`: lines 168, 176, 178, 197, 203, 209, 216, 222, 236, 242, 261, 266, 272, 276, 283.
- `src/components/progress/HistoryExerciseCard.tsx`: lines 48, 49, 52, 53, 156, 158, 189, 196, 214, 229, 235, 241, 255, 261.
- `src/components/progress/HistoryFilters.tsx`: lines 107, 122, 124, 132, 133, 145, 151, 155, 163, 167, 173.
- `src/components/progress/HistorySummary.tsx`: lines 16, 17, 23, 24, 30, 31, 40, 41, 81, 86, 98, 100, 119, 124.
- `src/components/progress/MasteryRing.tsx`: lines 27, 28, 206, 212, 218.
- `src/components/progress/ProgressOverview.tsx`: lines 112, 114, 126, 133, 146, 154, 161, 178, 184, 190, 199, 203, 210, 217.
- `src/components/progress/SubtopicProgressCard.tsx`: lines 33, 37, 41, 44, 113, 114, 130, 131, 149, 151, 170, 177, 189, 227.
- `src/components/progress/WeakSubtopicCard.tsx`: lines 136, 152, 159, 168, 176, 182, 196, 203, 211, 218, 222, 228, 236, 246, 254, 260, 266.
- `src/screens/HistoryScreen.tsx`: lines 75, 149, 166, 174, 178, 186, 194, 197, 204, 210, 215, 221, 226, 232, 238.
- `src/screens/ProgressScreen.tsx`: lines 99, 215, 219, 224, 240, 250, 256, 271, 279, 287, 294, 302, 313, 319, 325, 327, 335, 341, 348, 356, 358, 369, 375, 386.

**CONV-03 (warn; 7 hits)**

- `src/screens/HistoryScreen.tsx:46  <Pressable>`
- `src/screens/HistoryScreen.tsx:60  <Pressable>`
- `src/screens/HistoryScreen.tsx:87  <Pressable>`
- `src/screens/ProgressScreen.tsx:61  <Pressable>`
- `src/screens/ProgressScreen.tsx:116  <Pressable>`
- `src/screens/ProgressScreen.tsx:178  <Pressable>`
- `src/screens/ProgressScreen.tsx:196  <Pressable>`

**DOC-02 (error; 17 hits)**

- `src/components/progress/CourseSelector.tsx:1`
- `src/components/progress/HistoryExerciseCard.tsx:1`
- `src/components/progress/HistoryFilters.tsx:1`
- `src/components/progress/HistorySummary.tsx:1`
- `src/components/progress/MasteryRing.tsx:1`
- `src/components/progress/ProgressOverview.tsx:1`
- `src/components/progress/SubtopicProgressCard.tsx:1`
- `src/components/progress/WeakSubtopicCard.tsx:1`
- `src/components/progress/index.ts:1`
- `src/hooks/usePracticeHistory.ts:1`
- `src/hooks/useProgress.ts:1`
- `src/mocks/progress.mock.ts:1`
- `src/screens/HistoryScreen.tsx:1`
- `src/screens/ProgressScreen.tsx:1`
- `src/services/progress.contract.ts:1`
- `src/services/progress.service.ts:1`
- `src/types/progress.ts:1`

**DOC-03 (error; 22 hits)**

- `src/components/progress/CourseSelector.tsx:32  CourseSelector`
- `src/components/progress/HistoryExerciseCard.tsx:41  HistoryExerciseCard`
- `src/components/progress/HistoryFilters.tsx:32  HistoryFilters`
- `src/components/progress/HistorySummary.tsx:11  HistorySummary`
- `src/components/progress/ProgressOverview.tsx:27  ProgressOverview`
- `src/components/progress/SubtopicProgressCard.tsx:15  SubtopicProgressCard`
- `src/components/progress/WeakSubtopicCard.tsx:34  WeakSubtopicCard`
- `src/mocks/progress.mock.ts:34  MOCK_PROGRESS_COURSE_ID`
- `src/mocks/progress.mock.ts:36  MOCK_SUBTOPIC_EXERCISE_COUNTS`
- `src/mocks/progress.mock.ts:46  createCourseProgress`
- `src/mocks/progress.mock.ts:147  MOCK_ACADEMIC_PROGRESS`
- `src/mocks/progress.mock.ts:150  MOCK_EMPTY_ACADEMIC_PROGRESS`
- `src/mocks/progress.mock.ts:217  MOCK_HISTORY_RECOMMENDATION`
- `src/mocks/progress.mock.ts:225  MOCK_HISTORY_SUMMARY`
- `src/mocks/progress.mock.ts:238  MOCK_EMPTY_HISTORY_SUMMARY`
- `src/mocks/progress.mock.ts:251  createPracticeHistory`
- `src/mocks/progress.mock.ts:287  MOCK_PRACTICE_HISTORY`
- `src/mocks/progress.mock.ts:290  MOCK_CORRECT_HISTORY`
- `src/mocks/progress.mock.ts:293  MOCK_REVIEW_HISTORY`
- `src/mocks/progress.mock.ts:296  MOCK_EMPTY_PRACTICE_HISTORY`
- `src/screens/HistoryScreen.tsx:24  HistoryScreen`
- `src/screens/ProgressScreen.tsx:31  ProgressScreen`

**TEST-02 (warn; 4 hits)**

- `src/hooks/usePracticeHistory.ts`
- `src/hooks/useProgress.ts`
- `src/services/progress.contract.ts`
- `src/services/progress.service.ts`

### Manual inventory missed by the script

STYLE-02 only matches Tailwind bracket values; STYLE-03 only matches `style={{` and misses style arrays. DOC-04 misses the Spanish JSX comments listed in A14. TEST-02 uses substring matching and is not proof of behavior coverage. The following lists upward imports and a conservative inventory of nonzero literal RN style measurements in changed source; it excludes structural `flex: 1`, zero offsets and computed percentages. It is not a count of unique dimensions.

| File | Upward import lines | Literal measurement/typography lines |
|---|---|---|
| `src/components/progress/CourseSelector.tsx` | 23 | 164, 169, 171, 172, 177, 179, 180, 181, 182, 193, 198, 204, 205, 210, 218, 223, 224, 232, 237, 243, 254, 255, 256, 257, 267, 277, 279, 284, 286 |
| `src/components/progress/HistoryExerciseCard.tsx` | 12 | 157, 159, 160, 161, 170, 171, 172, 175, 179, 185, 190, 192, 197, 198, 202, 203, 204, 208, 213, 215, 221, 230, 231, 236, 242, 243, 244, 256, 262, 263 |
| `src/components/progress/HistoryFilters.tsx` | 10 | 102, 103, 108, 110, 123, 125, 126, 127, 128, 146, 156, 157, 158, 159, 168 |
| `src/components/progress/HistorySummary.tsx` | 5 | 78, 82, 87, 88, 89, 99, 101, 102, 103, 104, 107, 108, 109, 112, 115, 120, 125, 126 |
| `src/components/progress/MasteryRing.tsx` | — | 214, 219, 221, 222 |
| `src/components/progress/ProgressOverview.tsx` | 20 | 113, 115, 116, 117, 118, 127, 134, 135, 141, 142, 147, 148, 149, 150, 155, 160, 162, 174, 179, 185, 191, 192, 197, 198, 204, 205, 206, 211, 218, 219, 221 |
| `src/components/progress/SubtopicProgressCard.tsx` | 9 | 150, 152, 153, 154, 161, 166, 171, 173, 178, 179, 183, 188, 190, 196, 203, 209, 210, 211, 215, 216, 217, 218, 222, 228 |
| `src/components/progress/WeakSubtopicCard.tsx` | 23 | 137, 138, 139, 145, 149, 150, 151, 155, 160, 169, 171, 172, 177, 183, 184, 191, 197, 199, 204, 209, 210, 217, 223, 224, 229, 230, 231, 232, 237, 238, 239, 255, 261, 262, 267, 269 |
| `src/hooks/usePracticeHistory.ts` | 19, 25 | — |
| `src/hooks/useProgress.ts` | 19, 23 | — |
| `src/mocks/progress.mock.ts` | 28 | — |
| `src/screens/HistoryScreen.tsx` | 12, 17 | 152, 153, 158, 161, 162, 165, 172, 177, 179, 183, 187, 191, 195, 196, 198, 200, 203, 205, 208, 214, 217, 218, 223, 227, 228, 229, 233, 235, 239, 240 |
| `src/screens/ProgressScreen.tsx` | 12, 13, 15, 17, 18, 19, 20 | 220, 221, 222, 223, 233, 234, 236, 241, 242, 251, 257, 258, 266, 267, 272, 273, 275, 280, 281, 283, 288, 295, 296, 297, 298, 303, 308, 309, 314, 320, 321, 326, 328, 329, 331, 336, 337, 342, 349, 350, 352, 357, 359, 360, 361, 362, 370, 376, 381, 382, 387 |
| `src/services/progress.contract.ts` | 22 | — |
| `src/services/progress.service.ts` | 17, 24 | — |


## Cross-branch shared refactors and integration resolution

### Reuse and generalization map

The mobile inventory is already present in D and I (`F/REFERENCE.md:22`). The web-only TextField/Avatar/Select/Modal/Callout list at `:20` is a reference for API consistency, **not evidence that those mobile primitives already exist**.

| Duplication/overlap | Existing building block and evidence | Shared resolution |
|---|---|---|
| Native text/default platform fonts and Unicode icons throughout both features | `I/src/components/ui/Text.tsx:23`, `:68`; `I/src/components/ui/Icon.tsx:1`; token typography/font families | Use Text/Icon and add legitimate missing ligatures to IconName, rather than literal glyphs or untyped strings. |
| Submit/logout/retry/practice controls | `I/src/components/ui/Button.tsx:16`, `:80` | Reuse primary/tonal/danger/danger-soft/ghost variants. If loading support is needed, generalize Button with typed props and focused tests. |
| Card containers/status badges/icon wrappers/linear progress | `I/src/components/ui/Card.tsx:1`, `Chip.tsx:16`, `IconBox.tsx:1`, `ProgressBar.tsx:14` | Compose primitives; use typed tone maps. Do not carry the teammate palette into tokens. |
| Loading/error/empty state wrappers | `I/src/components/ui/LoadingState.tsx:1`, `ErrorState.tsx:1`, `EmptyState.tsx:41` | Replace repeated screen markup; EmptyState already supports actionLabel/onAction. |
| Header/scrolling gutters/safe-area shell/back links | `I/src/components/layout/AppHeader.tsx:41`, `ScreenContainer.tsx:33`, `BackLink.tsx:1`, `BottomTabBar.tsx:1` | Reuse AppHeader/ScreenContainer for tab screens; keep one BottomTabBar. Extract a reusable brand mark/auth layout if sign-in's badge/registration hero need a distinct composition. |
| Profile modal | `A/src/screens/ProfileScreen.tsx:209`; `I/src/components/ui/ConfirmDialog.tsx:58` | Preserve reuse, correct copy/icon props; evaluate shared blur only to meet the supplied frame. |
| AuthTextField, checkbox and PreferenceRow switch | `A/src/components/auth/AuthTextField.tsx:73`, `PreferenceRow.tsx:62`; no equivalent in current mobile ui barrel | Add generic TextField/Checkbox/Toggle primitives to ui with token styles and exported documented APIs. Keep profile labels/business actions in feature code/hooks. |
| AuthAlert, history advice, urgent recommendation card | `A/src/components/auth/AuthAlert.tsx:19`; `P/src/components/progress/WeakSubtopicCard.tsx:58`; `I/src/components/ui/HeroBanner.tsx:1` | Reuse HeroBanner where its API/layout fits; otherwise add a generic tone-based Callout in ui. Keep the actual recommendation data in hooks/services. |
| Course selector and history filter controls | `P/src/components/progress/CourseSelector.tsx:55`; `HistoryFilters.tsx:50` | Generalize a shared selector/dialog and segmented/filter control under ui if needed; no existing mobile Select is assumed. Derive counts/options from props. |
| Profile statistic tiles / ProgressOverview / course summaries | `A/src/components/auth/ProfileSummary.tsx:84`; `P/src/components/progress/ProgressOverview.tsx:67`; `I/src/components/courses/CourseProgressCard.tsx:25`, `MomentumCard.tsx:26` | Extract only truly shared statistic/mastery presentation into ui. The course-summary and progress frames differ, so avoid forcing one feature widget on both; components must not import another feature folder. |
| Linear subtopic bars and mastery classification | `P/src/components/progress/SubtopicProgressCard.tsx:31`; `I/src/components/courses/SubtopicCard.tsx:17`; `I/src/utils/mastery.ts:13`, `:18`, `:31` | Use masteryTone (low <40, high >=70) with one shared Record map; retain feature-specific copy/layout. New progress thresholds currently classify 72 differently from accepted course presentation. |
| Circular mastery indicator | `P/src/components/progress/MasteryRing.tsx:34`; ui has linear ProgressBar only | Add/fix a reusable circular progress primitive in ui with valid geometry and semantic null state; do not assert a duplicate ring already exists. |
| Repeated read lifecycles / loading types | `P/src/hooks/useProgress.ts:89`; `usePracticeHistory.ts:102`; `I/src/hooks/useResource.ts:15`, `:43` | Keep course/filter state in feature hooks; reuse the generic loader/key/refetch mechanism and ResourceState rather than parallel implementations. |
| Delay/scenario infrastructure | `A/src/services/auth.service.ts:57`; `P/src/services/progress.service.ts:38`; `I/src/mocks/scenario.ts:28`, `:44` | Reuse respond/isEmptyScenario. Put simulated implementations in mocks and keep service exports as the contract boundary; make selected scenario consistent across features. |
| Domain summaries and fixtures | `A/src/types/auth.ts:55`; `P/src/types/progress.ts:46`, `:94`; `I/src/types/course.ts:14`, `:68`; `I/src/types/exercise.ts:101` | Preserve existing EnrolledCourse/StudentSubtopic reuse (already done by progress). Adapt session/profile identity and reference recorded PracticeResult attempt IDs. Do not conflate solved/profile totals, high-mastery subtopics and practiced-subtopic counts: they have different meanings. |
| Pure helpers | `A/src/components/auth/ProfileSummary.tsx:19`, `:32`; `P/src/components/progress/HistoryExerciseCard.tsx:19`, `:33`; `I/src/utils/plural.ts:1` | Move shared initials/date/duration formatting and email validation to utils with deterministic tests; reuse plural where needed. No existing date/initials helper is claimed. |

### Conflict and behavioral-risk matrix

Read-only `git merge-tree <merge-base> feature/ui-integration <teammate>` found **only RootNavigator.tsx as an overlapping changed file**, with two auth conflict regions and one progress conflict region. This command did not create a merge/worktree or modify the index. Other rows are behavioral/API risks, not invented textual conflicts.

| File/contract | Evidence | Resolution |
|---|---|---|
| `src/navigation/RootNavigator.tsx` (both teammate branches and I) | A:28/73; P:21/58; I:12/25/56 | Resolve once on the accepted file: retain all accepted imports/screens, add real SignIn/SignUp/Profile/Progress/History, preserve custom tabs, add session guard. Both teammate versions contain placeholders; do not choose either complete file as the merge resolution. |
| `App.tsx` | Auth adds provider at A:28; I:25 is still the unchanged provider/navigation root | Keep AuthProvider and the accepted SafeAreaProvider/NavigationContainer theme. Session startup decides sign-in; do not retain the Tabs bypass. No textual conflict with I is present today. |
| `src/navigation/types.ts` / root navigation hook | Both teammate trees retain develop's ExerciseResult pair at line 32; I:32 uses attemptId and I/useRootNavigation.ts:23 supplies typed access | Keep accepted attemptId contract and helper. Adapt history callbacks/data, not result routes back to the old pair. Teammate branches do not change this file, so Git can merge it cleanly while semantic drift remains. |
| Shell/layout and token changes | Shared files are not changed by teammates; I/AppHeader:44 consumes insets, I/ScreenContainer:48 provides token gutters; I modifies tokens relative to D | Preserve I's shell/tokens. Adopt them in new screens; integrate additional generic controls/tokens deliberately with consistent naming and API. No current textual layout/token conflict. |
| Student/course fixtures and shared types | `I/src/mocks/courses.mock.ts:18/30/58`; A auth.service:139/216; P ProgressScreen:12 and progress.mock:50 | Use one authenticated student identity and enrollment set; prevent successful registration from inheriting demo courses. Shared types/course mocks are unchanged by teammates, so this is a behavioral integration risk. |
| Practice fixtures/results vs history | `I/src/mocks/practice.mock.ts:31/72/106`; `P/src/mocks/progress.mock.ts:163/164` | Define valid history→result identity mappings. Accepted sample IDs are `ex-<subtopicId>:<optionId>`; unrelated titles need their own matching result fixtures, rather than a fabricated match. |
| Mock scenario and session invalidation | I/scenario:16; I/useMyCourses:24 has constant resource key; A/AuthContext:179/203; P/useProgress:57 | Scope/invalidate data on login/logout and share empty scenarios. A fixed key can keep previous session data on a mounted consumer; test session changes and tab mounting explicitly. |
| `package-lock.json` | A:12152 changes only TypeScript `devOptional: true` to `dev: true`; package.json unchanged; P/I do not change the lock from D | Retain baseline/integration lock or explain deliberate metadata normalization. This is one-line metadata churn, not a dependency upgrade or current lock conflict. |
| Existing smoke and accepted flow tests | `A/__tests__/App.test.tsx:20`; `I/__tests__/flows/StudentFlows.test.tsx:22/53/67` | Update smoke expectations for sign-in and authenticate in accepted flow setup. Preserve courses→subtopics→exercise→result→continue and bell→invitation→confirm→course assertions. They currently assume direct tab entry and were not run against a merged auth tree. |

### Shared acceptance gate

- [ ] One authoritative token palette and component API; every new primitive lives in ui/layout with documented typed variants, props, accessibility and focused tests.
- [ ] One session-bound student/course/history fixture model; the registered-user empty enrollment flow and demo-user populated flow both work.
- [ ] Fresh launch → SignIn; valid login → Courses; registration → empty Courses; logout confirmation/cancel behave correctly; signed-out back navigation cannot return to tabs.
- [ ] Courses/Progreso/Historial/Perfil and all required 1/2/7/8/9 transitions above work with accepted route parameters. No placeholder replaces already accepted functionality.
- [ ] Existing accepted student flows plus the new auth/progress/history tests pass; lint/typecheck/audit pass on the actual resolved integration.
- [ ] Canonical TSDoc, English implementation comments, aliases and layer READMEs are complete; real secrets and environment values are excluded from documentation.
- [ ] Native visual verification covers all 17 supplied states, safe areas/keyboard/touch targets and small/tablet layouts. Source-based audit findings alone do not constitute visual sign-off.

