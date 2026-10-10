/**
 * Tests cookie transport, safe HTTP errors and session-expiry behavior.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { apiClient, ApiError } from '@/services/http/apiClient';
import { API_BASE_URL } from '@/config/api';
import { getSession, setSession } from '@/services/http/session';
import { TEST_USER } from '@/test/apiFixtures';
import { jsonResponse, resetApiStub } from '@/test/fetchStub';
import { normalizeAuthError } from '@/utils/auth';
let fetchSpy: ReturnType<typeof resetApiStub>;
beforeEach(() => {
  fetchSpy = resetApiStub();
});
afterEach(() => jest.restoreAllMocks());
test('sends credentials and JSON headers without exposing a token', async () => {
  fetchSpy.mockResolvedValueOnce(jsonResponse({ id: 'created' }, 201));
  await expect(apiClient.post('/resource', { enabled: true })).resolves.toEqual(
    { id: 'created' },
  );
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/resource`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: '{"enabled":true}',
    signal: undefined,
  });
});
test('accepts a 204 response without trying to parse JSON', async () => {
  const response = jsonResponse(undefined, 204);
  const json = jest.spyOn(response, 'json');
  fetchSpy.mockResolvedValueOnce(response);
  await expect(
    apiClient.post('/authentication/sign-out'),
  ).resolves.toBeUndefined();
  expect(json).not.toHaveBeenCalled();
});
test.each([
  [401, '/courses/one/student-progress', 'UNAUTHORIZED'],
  [401, '/authentication/sign-in', 'INVALID_CREDENTIALS'],
  [403, '/authentication/sign-in', 'MOBILE_ACCESS_DENIED'],
  [403, '/resource', 'FORBIDDEN'],
  [404, '/resource', 'NOT_FOUND'],
  [404, '/practice-exercises', 'NO_EXERCISES'],
  [409, '/authentication/sign-up', 'EMAIL_ALREADY_REGISTERED'],
  [409, '/resource', 'CONFLICT'],
  [503, '/practice-exercises', 'SERVICE_UNAVAILABLE'],
])(
  'maps HTTP %s on %s to %s without exposing ProblemDetail text',
  async (status, path, code) => {
    const body = {
      status,
      title: 'Failure',
      detail: 'Sensitive internal detail',
    };
    fetchSpy.mockResolvedValueOnce(jsonResponse(body, status));
    const error = await apiClient
      .get(path, { auth: path.startsWith('/authentication/') })
      .catch(reason => reason);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status, code, body });
    if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
    expect(error.message).not.toContain('Sensitive');
    expect(normalizeAuthError(error).code).toBe(code);
  },
);
test('clears the identity for a protected 401 but preserves it for invalid sign-in', async () => {
  setSession({ user: TEST_USER });
  fetchSpy.mockResolvedValueOnce(jsonResponse(undefined, 401));
  await expect(
    apiClient.get('/courses/one/student-progress'),
  ).rejects.toMatchObject({ status: 401 });
  expect(getSession()).toBeNull();
  setSession({ user: TEST_USER });
  fetchSpy.mockResolvedValueOnce(jsonResponse(undefined, 401));
  await expect(
    apiClient.post('/authentication/sign-in', {}, { auth: true }),
  ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  expect(getSession()?.user).toEqual(TEST_USER);
});
test('does not clear a newer session when an old request returns 401', async () => {
  setSession({ user: TEST_USER });
  let resolve!: (response: Response) => void;
  fetchSpy.mockImplementationOnce(
    () =>
      new Promise(done => {
        resolve = done;
      }),
  );
  const pending = apiClient.get('/resource');
  setSession({ user: { ...TEST_USER, id: 'student-2' } });
  resolve(jsonResponse(undefined, 401));
  await expect(pending).rejects.toMatchObject({ status: 401 });
  expect(getSession()?.user.id).toBe('student-2');
});
test('normalizes network failures and preserves request cancellation', async () => {
  fetchSpy.mockRejectedValueOnce(new TypeError('Network request failed'));
  await expect(apiClient.get('/resource')).rejects.toMatchObject({
    status: 0,
    code: 'NETWORK_ERROR',
  });
  const error = Object.assign(new Error('Cancelled'), { name: 'AbortError' });
  fetchSpy.mockRejectedValueOnce(error);
  const signal = new AbortController().signal;
  await expect(apiClient.get('/resource', { signal })).rejects.toBe(error);
  expect(fetchSpy).toHaveBeenLastCalledWith(
    `${API_BASE_URL}/resource`,
    expect.objectContaining({ signal }),
  );
});
