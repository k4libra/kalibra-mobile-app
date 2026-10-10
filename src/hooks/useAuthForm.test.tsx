/**
 * Tests for account form validation, notices and duplicate-email recovery.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AuthProvider } from '@/context/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';
import { authService } from '@/services/auth.service';
import { DEMO_CREDENTIALS, MOCK_AUTH_USER } from '@/mocks/auth.mock';
let tree: ReactTestRenderer.ReactTestRenderer;
let value: ReturnType<typeof useAuthForm>;
async function render(mode: 'signIn' | 'signUp') {
  function Probe() { value = useAuthForm(mode); return null; }
  await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<AuthProvider><Probe /></AuthProvider>); });
}
beforeEach(() => {
  jest.spyOn(authService, 'getCurrentSession').mockResolvedValue(null);
  jest.spyOn(authService, 'getStudyPreview').mockResolvedValue({ image: 1, description: 'Study preview', planDescription: 'Generic subjects' });
});
afterEach(() => { ReactTestRenderer.act(() => tree?.unmount()); jest.restoreAllMocks(); });
test('retains email feedback when dismissing only the credential notice', async () => {
  jest.spyOn(authService, 'signIn').mockRejectedValue(Object.assign(new Error('failure'), { code: 'INVALID_CREDENTIALS' }));
  await render('signIn');
  ReactTestRenderer.act(() => { value.setEmail(DEMO_CREDENTIALS.email); value.setPassword('wrong'); });
  await ReactTestRenderer.act(async () => { await value.submit(); });
  expect(value.notice).toBeTruthy(); expect(value.fieldErrors.email).toBe('Revisa este dato');
  ReactTestRenderer.act(() => value.dismissNotice());
  expect(value.notice).toBeNull(); expect(value.fieldErrors.email).toBe('Revisa este dato'); expect(value.password).toBe('wrong');
});
test('validates registration inline before calling the service', async () => {
  const signUp = jest.spyOn(authService, 'signUp');
  await render('signUp');
  await ReactTestRenderer.act(async () => { await value.submit(); });
  expect(value.fieldErrors).toHaveProperty('email'); expect(signUp).not.toHaveBeenCalled();
});
test('clears duplicate-email recovery without losing name or password', async () => {
  jest.spyOn(authService, 'signUp').mockRejectedValue(Object.assign(new Error('duplicate'), { code: 'EMAIL_ALREADY_REGISTERED' }));
  await render('signUp');
  ReactTestRenderer.act(() => { value.setFullName('Student'); value.setEmail(DEMO_CREDENTIALS.email); value.setPassword('Example2025!'); });
  await ReactTestRenderer.act(async () => { await value.submit(); });
  expect(value.isDuplicate).toBe(true);
  ReactTestRenderer.act(() => value.useAnotherEmail());
  expect(value.isDuplicate).toBe(false); expect(value.email).toBe(''); expect(value.fullName).toBe('Student'); expect(value.password).toBe('Example2025!');
});
test('sends the current fields and remember-device preference', async () => {
  const signIn = jest.spyOn(authService, 'signIn').mockResolvedValue({ user: MOCK_AUTH_USER, accessToken: 'mock-form' });
  await render('signIn');
  ReactTestRenderer.act(() => { value.setEmail(DEMO_CREDENTIALS.email); value.setPassword(DEMO_CREDENTIALS.password); value.setRememberDevice(false); });
  await ReactTestRenderer.act(async () => { await value.submit(); });
  expect(signIn).toHaveBeenCalledWith(DEMO_CREDENTIALS);
});
