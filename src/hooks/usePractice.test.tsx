/**
 * Tests for the adaptive practice hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { practiceService } from '@/services/practice.service';
import { mapResult } from '@/services/mappers/practice';
import { TEST_ATTEMPTS, TEST_COURSES, TEST_CREDENTIALS } from '@/test/apiFixtures';
import type { PracticeResult } from '@/types/exercise';
import { resetApiStub } from '@/test/fetchStub';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PracticeProvider } from '@/context/PracticeContext';
import { useExercise, usePracticeResult } from './usePractice';

jest.useFakeTimers();
const trees: ReactTestRenderer.ReactTestRenderer[] = [];

async function renderHook<T>(hook: () => T): Promise<() => T> {
  let value: T;
  function Probe() {
    value = hook();
    return null;
  }
  ReactTestRenderer.act(() => {
    trees.push(ReactTestRenderer.create(<PracticeProvider><Probe /></PracticeProvider>));
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  return () => value;
}


beforeEach(async () => {
  resetApiStub();
  const request = authService.signIn(TEST_CREDENTIALS);
  jest.runAllTimers();
  await request;
});
afterEach(async () => {
  await ReactTestRenderer.act(async () => {
    trees.splice(0).forEach(tree => tree.unmount());
    jest.runAllTimers();
  });
  jest.restoreAllMocks();
});

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

  it('keeps the same position after a failed submission and allows a retry', async () => {
    const result = await renderHook(() => useExercise('course-1', 'sub-1'));
    const submitSpy = jest.spyOn(practiceService, 'submitAnswer').mockRejectedValueOnce(new Error('Try again'));
    await ReactTestRenderer.act(async () => {
      expect(await result().submit(result().exercise!.id, 'A')).toBeNull();
    });
    expect(result().error).toBe('Try again');
    expect(result().exercise?.position).toBe(1);
    await ReactTestRenderer.act(async () => {
      expect(await result().submit(result().exercise!.id, 'A')).toMatchObject({ isCorrect: true });
    });
    expect(result().error).toBeNull();
    expect(submitSpy).toHaveBeenCalledTimes(2);
  });

  it('submits only once when the answer action is triggered twice before completion', async () => {
    const result = await renderHook(() => useExercise('course-1', 'sub-1'));
    let resolveAnswer!: (value: PracticeResult) => void;
    const answer = mapResult(TEST_ATTEMPTS[0], TEST_COURSES[0], result().exercise!.id);
    const submitSpy = jest.spyOn(practiceService, 'submitAnswer').mockImplementationOnce(() => new Promise(resolve => { resolveAnswer = resolve; }));
    await ReactTestRenderer.act(async () => {
      const pending = result().submit(result().exercise!.id, 'A');
      expect(await result().submit(result().exercise!.id, 'A')).toBeNull();
      resolveAnswer(answer);
      expect(await pending).toEqual(answer);
    });
    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(result().isSubmitting).toBe(false);
  });
});

describe('usePracticeResult', () => {
  it('loads a recorded result', async () => {
    const result = await renderHook(() => usePracticeResult('attempt-2'));
    expect(result().result?.isCorrect).toBe(false);
  });
});
