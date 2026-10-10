/**
 * Tests for profile reads, preferences, confirmation and stale responses.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AuthProvider } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { authService } from '@/services/auth.service';
import { MOCK_AUTH_USER } from '@/mocks/auth.mock';
const profile = { user: MOCK_AUTH_USER, stats: { solvedExerciseCount: 77, averageMastery: 71, activeCourseCount: 3 }, preferences: { darkMode: false, dailyReminders: true } };
let tree: ReactTestRenderer.ReactTestRenderer;
let value: ReturnType<typeof useProfile>;
async function render() { function Probe() { value = useProfile(); return null; } await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<AuthProvider><Probe /></AuthProvider>); }); }
beforeEach(() => {
  jest.spyOn(authService, 'getCurrentSession').mockResolvedValue({ user: MOCK_AUTH_USER, accessToken: 'mock-profile' });
  jest.spyOn(authService, 'getProfile').mockResolvedValue(profile);
});
afterEach(() => { ReactTestRenderer.act(() => tree?.unmount()); jest.restoreAllMocks(); });
test('loads the profile through the shared resource hook and updates preferences', async () => {
  jest.spyOn(authService, 'updatePreferences').mockResolvedValue({ darkMode: true, dailyReminders: false });
  await render(); expect(value.profile?.user.fullName).toBe(MOCK_AUTH_USER.fullName);
  await ReactTestRenderer.act(async () => { await value.setDarkMode(true); });
  expect(value.profile?.preferences.darkMode).toBe(true);
});
test('exposes a failed read and a failed preference update', async () => {
  jest.spyOn(authService, 'getProfile').mockRejectedValue(new Error('Unavailable'));
  await render(); expect(value.error).toBe('Unavailable');
  jest.spyOn(authService, 'getProfile').mockResolvedValue(profile);
  await ReactTestRenderer.act(async () => value.refetch());
  jest.spyOn(authService, 'updatePreferences').mockRejectedValue(new Error('private server message'));
  await ReactTestRenderer.act(async () => { await value.setDailyReminders(false); });
  expect(value.error).toBe('Ocurrió un error inesperado. Inténtalo nuevamente.');
  expect(value.profile?.preferences.dailyReminders).toBe(true);
});
test('cancels logout without calling the endpoint and confirms it explicitly', async () => {
  const signOut = jest.spyOn(authService, 'signOut').mockResolvedValue({ success: true });
  await render();
  ReactTestRenderer.act(() => value.requestSignOut()); expect(value.isSignOutVisible).toBe(true);
  ReactTestRenderer.act(() => value.cancelSignOut()); expect(value.isSignOutVisible).toBe(false); expect(signOut).not.toHaveBeenCalled();
  await ReactTestRenderer.act(async () => { await value.confirmSignOut(); }); expect(signOut).toHaveBeenCalledTimes(1);
});
test('does not apply a preference response after its owner unmounts', async () => {
  let resolve!: (next: { darkMode: boolean; dailyReminders: boolean }) => void;
  jest.spyOn(authService, 'updatePreferences').mockImplementation(() => new Promise(done => { resolve = done; }));
  await render();
  let pending!: Promise<void>;
  ReactTestRenderer.act(() => { pending = value.setDarkMode(true); });
  ReactTestRenderer.act(() => tree.unmount());
  resolve({ darkMode: true, dailyReminders: true }); await pending;
  expect(value.profile?.preferences.darkMode).toBe(false);
});
