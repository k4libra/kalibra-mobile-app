/**
 * Tests the HTTP integration behavior of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { coursesService } from '@/services/courses.service';
import { TEST_CREDENTIALS, TEST_USER } from '@/test/apiFixtures';
import { jsonResponse, resetApiStub } from '@/test/fetchStub';
import { getSession } from '@/services/http/session';
import { API_BASE_URL } from '@/config/api';
let fetchSpy: ReturnType<typeof resetApiStub>;
const newAccount = { fullName: 'Student Example', email: 'estudiante.test4@upc.edu.pe', password: 'Example2025!' };
beforeEach(() => { fetchSpy = resetApiStub(); });
afterEach(() => jest.restoreAllMocks());
test('restores the cookie session and derives profile totals from course history and mastery', async () => {
  expect(await authService.getCurrentSession()).toBeNull();
  const session = await authService.signIn({ ...TEST_CREDENTIALS, email: ` ${TEST_CREDENTIALS.email.toUpperCase()} ` });
  expect(session.user).toEqual(TEST_USER);
  expect(await authService.getCurrentSession()).toEqual(session);
  expect((await authService.getProfile()).stats).toEqual({ solvedExerciseCount: 3, averageMastery: 67, activeCourseCount: 3 });
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/authentication/sign-in`, expect.objectContaining({
    method: 'POST', body: JSON.stringify({ email: TEST_CREDENTIALS.email, password: TEST_CREDENTIALS.password, application: 'MOBILE_APP' }), credentials: 'include',
  }));
});
test('registers with names and the mobile application then signs in to obtain the cookie', async () => {
  await authService.signUp(newAccount);
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/authentication/sign-up`, expect.objectContaining({ body: JSON.stringify({ firstName: 'Student', lastName: 'Example', email: newAccount.email, password: newAccount.password, application: 'MOBILE_APP' }) }));
  expect((await authService.getProfile()).stats).toEqual({ solvedExerciseCount: 0, averageMastery: null, activeCourseCount: 0 });
  expect(await coursesService.listCourses()).toEqual([]);
});
test('maps invalid credentials, duplicate email and forbidden mobile access', async () => {
  await expect(authService.signIn({ ...TEST_CREDENTIALS, password: 'wrong' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  await expect(authService.signUp({ ...newAccount, email: TEST_CREDENTIALS.email })).rejects.toMatchObject({ code: 'EMAIL_ALREADY_REGISTERED' });
  fetchSpy.mockResolvedValueOnce(jsonResponse({ status: 403, detail: 'Not a student' }, 403));
  await expect(authService.signIn(TEST_CREDENTIALS)).rejects.toMatchObject({ code: 'MOBILE_ACCESS_DENIED', message: 'Esta cuenta no tiene acceso a la app móvil' });
});
test('rejects invalid registration before sending any request', async () => {
  await expect(authService.signUp({ ...newAccount, email: 'student@gmail.com' })).rejects.toMatchObject({ code: 'INVALID_EMAIL' });
  await expect(authService.signUp({ ...newAccount, password: 'short' })).rejects.toMatchObject({ code: 'INVALID_PASSWORD' });
  await expect(authService.signUp({ ...newAccount, fullName: ' ' })).rejects.toMatchObject({ code: 'REQUIRED_FIELD' });
  expect(fetchSpy).not.toHaveBeenCalled();
});
test('persists preferences by account and uses the default reminder time only when unset', async () => {
  await authService.signIn(TEST_CREDENTIALS);
  await authService.updatePreferences({ darkMode: true, dailyReminders: true });
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/student-preferences/me/daily-reminder`, expect.objectContaining({ method: 'PUT', body: JSON.stringify({ enabled: true, time: '20:00:00' }) }));
  await authService.signOut();
  expect(getSession()).toBeNull();
  await authService.signUp(newAccount);
  expect((await authService.getProfile()).preferences.darkMode).toBe(false);
  await authService.signOut();
  await authService.signIn(TEST_CREDENTIALS);
  expect((await authService.getProfile()).preferences.darkMode).toBe(true);
});
test('does not publish a sign-in that finishes after sign-out', async () => {
  let resolve!: (response: Response) => void;
  fetchSpy.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  const pending = authService.signIn(TEST_CREDENTIALS);
  const outcome = pending.catch(reason => reason);
  await authService.signOut();
  resolve(jsonResponse({ id: TEST_USER.id, email: TEST_USER.email, firstName: 'Estudiante', lastName: 'Test Uno', roles: ['STUDENT'] }));
  expect(await outcome).toMatchObject({ code: 'UNAUTHORIZED' });
  expect(getSession()).toBeNull();
});
