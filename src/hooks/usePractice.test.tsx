/**
 * Tests for the adaptive practice hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useExercise, usePracticeResult } from './usePractice';

jest.useFakeTimers();

async function renderHook<T>(hook: () => T): Promise<() => T> {
  let value: T;
  function Probe() {
    value = hook();
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Probe />);
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  return () => value;
}

describe('useExercise', () => {
  it('loads the exercise and submits an answer', async () => {
    const result = await renderHook(() => useExercise('course-1', 'sub-1'));
    const exercise = result().exercise;
    expect(exercise?.options.length).toBeGreaterThan(1);
    let attempt = null;
    await ReactTestRenderer.act(async () => {
      const pending = result().submit(exercise!.id, exercise!.options[0].id);
      jest.runAllTimers();
      attempt = await pending;
    });
    expect(attempt).toMatchObject({ isCorrect: true });
  });
});

describe('usePracticeResult', () => {
  it('loads a recorded result', async () => {
    const result = await renderHook(() => usePracticeResult('ex-sub-1:opt-c'));
    expect(result().result?.isCorrect).toBe(false);
  });
});
