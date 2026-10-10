/**
 * Tests local practice session counting, outcomes and account isolation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AuthContext } from '@/context/AuthContext';
import { TEST_USER } from '@/test/apiFixtures';
import { usePracticeSessionState, type PracticeSessionState } from './usePracticeSession';

let tree: ReactTestRenderer.ReactTestRenderer;
let state: PracticeSessionState;

function Probe() {
  state = usePracticeSessionState();
  return null;
}

function subject(accountId = TEST_USER.id) {
  return <AuthContext.Provider value={{ session: { user: { ...TEST_USER, id: accountId } }, isLoading: false, setSession: jest.fn() }}>
    <Probe />
  </AuthContext.Provider>;
}

beforeEach(async () => { await act(async () => { tree = ReactTestRenderer.create(subject()); }); });
afterEach(async () => { await act(async () => { tree.unmount(); }); });

test('counts each loaded route once and caps a visit at five exercises', async () => {
  expect(state.session).toBeNull();
  for (let position = 1; position <= 5; position++) {
    await act(async () => { state.registerExercise('course-1', 'sub-1', `route-${position}`); });
    await act(async () => { state.registerExercise('course-1', 'sub-1', `route-${position}`); });
    expect(state.session?.position).toBe(position);
    await act(async () => { state.recordAnswer(`route-${position}`, `attempt-${position}`, true); });
  }
  await act(async () => {
    state.registerExercise('course-1', 'sub-1', 'route-6');
    state.recordAnswer('route-6', 'attempt-6', true);
  });
  expect(state.session?.position).toBe(5);
  expect(state.session?.outcomes).toHaveLength(5);
});

test('records only one successful outcome for the active exercise', async () => {
  await act(async () => { state.registerExercise('course-1', 'sub-1', 'route-1'); });
  await act(async () => { state.recordAnswer('stale-route', 'attempt-0', true); });
  expect(state.session?.outcomes).toEqual([]);
  await act(async () => { state.recordAnswer('route-1', 'attempt-1', false); });
  await act(async () => { state.recordAnswer('route-1', 'attempt-1', false); });
  expect(state.session).toMatchObject({ outcomes: [false], attemptId: 'attempt-1', position: 1 });
});

test('starts at one when the subtopic or course changes', async () => {
  await act(async () => { state.registerExercise('course-1', 'sub-1', 'route-1'); });
  await act(async () => { state.registerExercise('course-1', 'sub-1', 'route-2'); });
  expect(state.session?.position).toBe(2);
  await act(async () => { state.registerExercise('course-1', 'sub-2', 'route-3'); });
  expect(state.session).toMatchObject({ subtopicId: 'sub-2', position: 1, outcomes: [] });
  await act(async () => { state.registerExercise('course-2', 'sub-2', 'route-4'); });
  expect(state.session).toMatchObject({ courseId: 'course-2', position: 1, outcomes: [] });
});

test('discards progress and outcomes when the authenticated account changes', async () => {
  await act(async () => { state.registerExercise('course-1', 'sub-1', 'route-1'); });
  await act(async () => { state.recordAnswer('route-1', 'attempt-1', true); });
  await act(async () => { tree.update(subject('student-2')); });
  expect(state.session).toBeNull();
  await act(async () => { state.registerExercise('course-1', 'sub-1', 'route-2'); });
  expect(state.session).toMatchObject({ accountId: 'student-2', position: 1, outcomes: [] });
});
