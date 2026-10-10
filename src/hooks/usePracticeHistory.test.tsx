/**
 * Tests for the practice history hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { authService } from '@/services/auth.service';
import { resetApiStub } from '@/test/fetchStub';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { usePracticeHistory } from './usePracticeHistory';

jest.useFakeTimers();

beforeEach(async () => { resetApiStub(); await authService.signIn(TEST_CREDENTIALS); });
afterEach(() => jest.restoreAllMocks());

test('filters the loaded history by outcome', async () => {
  let state: ReturnType<typeof usePracticeHistory> | undefined;
  function Probe() {
    state = usePracticeHistory();
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Probe />);
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  expect(state?.entries.length).toBe(3);
  await ReactTestRenderer.act(async () => state?.setFilter('review'));
  expect(state?.entries.every(entry => entry.result === 'incorrect')).toBe(true);
  await ReactTestRenderer.act(async () => state?.setFilter('correct'));
  expect(state?.entries.every(entry => entry.result === 'correct')).toBe(true);
});
