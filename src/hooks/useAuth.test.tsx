/**
 * Tests for the session provider and normalized authentication actions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { DEMO_CREDENTIALS, MOCK_AUTH_USER } from '@/mocks/auth.mock';
const session = { user: MOCK_AUTH_USER, accessToken: 'mock-test' };
let tree: ReactTestRenderer.ReactTestRenderer;
let value: ReturnType<typeof useAuth>;
function Probe() { value = useAuth(); return null; }
async function render() { await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<AuthProvider><Probe /></AuthProvider>); }); }
beforeEach(() => { jest.spyOn(authService, 'getCurrentSession').mockResolvedValue(null); });
afterEach(() => { ReactTestRenderer.act(() => tree?.unmount()); jest.restoreAllMocks(); });
test('restores signed-out state and publishes a successful sign-in', async () => {
  jest.spyOn(authService, 'signIn').mockResolvedValue(session);
  await render(); expect(value.isAuthenticated).toBe(false);
  await ReactTestRenderer.act(async () => { await value.signIn(DEMO_CREDENTIALS); });
  expect(value.session).toEqual(session);
  expect(value.isSubmitting).toBe(false);
});
test('normalizes failures without changing the session', async () => {
  jest.spyOn(authService, 'signIn').mockRejectedValue(Object.assign(new Error('failure'), { code: 'INVALID_CREDENTIALS' }));
  await render();
  await ReactTestRenderer.act(async () => { await value.signIn(DEMO_CREDENTIALS); });
  expect(value.error?.code).toBe('INVALID_CREDENTIALS'); expect(value.session).toBeNull();
});
test('removes the protected session before a delayed sign-out completes', async () => {
  jest.spyOn(authService, 'getCurrentSession').mockResolvedValue(session);
  let resolve!: () => void;
  jest.spyOn(authService, 'signOut').mockImplementation(() => new Promise(done => { resolve = () => done({ success: true }); }));
  await render();
  let pending!: Promise<void>;
  ReactTestRenderer.act(() => { pending = value.signOut(); });
  expect(value.session).toBeNull();
  await ReactTestRenderer.act(async () => { resolve(); await pending; });
});
test('ignores authentication that finishes after its owner unmounts', async () => {
  let resolve!: (next: typeof session) => void;
  jest.spyOn(authService, 'signIn').mockImplementation(() => new Promise(done => { resolve = done; }));
  await render();
  let pending!: ReturnType<typeof value.signIn>;
  ReactTestRenderer.act(() => { pending = value.signIn(DEMO_CREDENTIALS); });
  ReactTestRenderer.act(() => tree.unmount());
  resolve(session); expect(await pending).toBeNull();
});
test('requires the session provider', () => {
  expect(() => { ReactTestRenderer.act(() => { ReactTestRenderer.create(<Probe />); }); }).toThrow('useAuth requires AuthProvider.');
});
