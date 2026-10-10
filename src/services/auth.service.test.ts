/**
 * Behavior tests for authentication and account-scoped simulated endpoints.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { coursesService } from '@/services/courses.service';
import { invitationsService } from '@/services/invitations.service';
import { practiceService } from '@/services/practice.service';
import { DEMO_CREDENTIALS, resetAuthMock } from '@/mocks/auth.mock';
import * as scenario from '@/mocks/scenario';
jest.useFakeTimers();
async function settle<T>(request: Promise<T>): Promise<T> { jest.runAllTimers(); return request; }
const newAccount = { fullName: 'Student Example', email: 'student@campus.edu.pe', password: 'Example2025!' };
beforeEach(resetAuthMock);
afterEach(() => { jest.restoreAllMocks(); jest.clearAllTimers(); });
test('starts signed out and restores a successful demo session', async () => {
  expect(await settle(authService.getCurrentSession())).toBeNull();
  const session = await settle(authService.signIn({ ...DEMO_CREDENTIALS, email: `  ${DEMO_CREDENTIALS.email.toUpperCase()}  ` }));
  expect(await settle(authService.getCurrentSession())).toEqual(session);
  expect((await settle(authService.getProfile())).stats).toEqual({ solvedExerciseCount: 77, averageMastery: 71, activeCourseCount: 3 });
});
test('rejects invalid credentials and a duplicate institutional address', async () => {
  await expect(settle(authService.signIn({ ...DEMO_CREDENTIALS, password: 'wrong' }))).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  await expect(settle(authService.signUp({ ...newAccount, email: DEMO_CREDENTIALS.email }))).rejects.toMatchObject({ code: 'EMAIL_ALREADY_REGISTERED' });
});
test('rejects malformed registration fields', async () => {
  await expect(settle(authService.signUp({ ...newAccount, email: 'student@gmail.com' }))).rejects.toMatchObject({ code: 'INVALID_EMAIL' });
  await expect(settle(authService.signUp({ ...newAccount, password: 'short' }))).rejects.toMatchObject({ code: 'INVALID_PASSWORD' });
  await expect(settle(authService.signUp({ ...newAccount, fullName: ' ' }))).rejects.toMatchObject({ code: 'REQUIRED_FIELD' });
});
test('registers an isolated account with zero totals and no demo academic data', async () => {
  await settle(authService.signUp(newAccount));
  expect((await settle(authService.getProfile())).stats).toEqual({ solvedExerciseCount: 0, averageMastery: null, activeCourseCount: 0 });
  expect((await settle(coursesService.getStudent())).firstName).toBe('Student');
  expect(await settle(coursesService.listCourses())).toEqual([]);
  expect(await settle(invitationsService.listInvitations())).toEqual([]);
  await expect(coursesService.getCourse('course-1')).rejects.toThrow();
  await expect(practiceService.getResult('ex-sub-1:opt-a')).rejects.toThrow();
});
test('keeps preferences independent across logout and account changes', async () => {
  await settle(authService.signIn(DEMO_CREDENTIALS));
  await settle(authService.updatePreferences({ darkMode: true, dailyReminders: false }));
  await settle(authService.signOut());
  await settle(authService.signUp(newAccount));
  expect((await settle(authService.getProfile())).preferences).toEqual({ darkMode: false, dailyReminders: true });
  await settle(authService.signOut());
  await settle(authService.signIn(DEMO_CREDENTIALS));
  expect((await settle(authService.getProfile())).preferences).toEqual({ darkMode: true, dailyReminders: false });
});
test('discards a preference request that completes after logout', async () => {
  await settle(authService.signIn(DEMO_CREDENTIALS));
  const pending = authService.updatePreferences({ darkMode: true });
  const outcome = pending.catch(reason => reason);
  await settle(authService.signOut());
  expect(await outcome).toMatchObject({ code: 'UNAUTHORIZED' });
});
test('cannot restore an obsolete sign-in after logout', async () => {
  const pending = authService.signIn(DEMO_CREDENTIALS);
  const outcome = pending.catch(reason => reason);
  await settle(authService.signOut());
  expect(await outcome).toMatchObject({ code: 'UNAUTHORIZED' });
  expect(await settle(authService.getCurrentSession())).toBeNull();
});
test('honors the shared empty scenario for the authenticated demo', async () => {
  jest.spyOn(scenario, 'isEmptyScenario').mockReturnValue(true);
  await settle(authService.signIn(DEMO_CREDENTIALS));
  expect(await settle(coursesService.listCourses())).toEqual([]);
  expect((await settle(authService.getProfile())).stats.solvedExerciseCount).toBe(0);
  expect((await settle(coursesService.getStudent())).averageMastery).toBe(0);
});
