/**
 * Tests for the practice history hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { setMockSession } from '@/mocks/session.mock';
import { usePracticeHistory } from './usePracticeHistory';

jest.useFakeTimers();

const demo = { user: { id: 'student-1', fullName: 'Valentina Morales Rivera', email: 'v.morales@upc.edu.pe' }, token: 'mock' };

afterEach(() => setMockSession(null));

test('filters the loaded history by outcome', async () => {
  setMockSession(demo as never);
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
