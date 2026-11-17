/**
 * Exercise calibration hold and reveal lifecycle tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Animated } from 'react-native';
import { useExerciseCalibration } from './useExerciseCalibration';
import { useReducedMotion } from './useReducedMotion';

jest.mock('./useReducedMotion', () => ({ useReducedMotion: jest.fn() }));
jest.useFakeTimers();

let tree: ReactTestRenderer.ReactTestRenderer | undefined;
let calibration: ReturnType<typeof useExerciseCalibration>;

function Probe({ exerciseId, isLoading = false, hasLevel = true }: { exerciseId?: string; isLoading?: boolean; hasLevel?: boolean }) {
  calibration = useExerciseCalibration(exerciseId, isLoading, hasLevel);
  return null;
}

async function render(exerciseId?: string, isLoading = false, hasLevel = true) {
  await act(async () => { tree = ReactTestRenderer.create(<Probe exerciseId={exerciseId} isLoading={isLoading} hasLevel={hasLevel} />); });
}

async function advance(milliseconds: number) {
  await act(async () => { jest.advanceTimersByTime(milliseconds); });
}

beforeEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
});

afterEach(async () => {
  await act(async () => { tree?.unmount(); });
  tree = undefined;
  jest.restoreAllMocks();
  jest.clearAllTimers();
});

test('keeps calibration visible while loading and reports a long wait after six seconds', async () => {
  await render(undefined, true);
  expect(calibration).toMatchObject({ showCalibration: true, isVisible: false, isReady: false, isLongWait: false });
  await advance(5999);
  expect(calibration.isLongWait).toBe(false);
  await advance(1);
  expect(calibration).toMatchObject({ showCalibration: true, isVisible: false, isReady: false, isLongWait: true });
  await act(async () => { tree!.update(<Probe exerciseId="exercise-1" />); });
  expect(calibration.isLongWait).toBe(false);
});

test('holds the selected difficulty level for 550 ms and completes after the 250 ms crossfade', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  await render(undefined, true);
  await act(async () => { tree!.update(<Probe exerciseId="exercise-1" />); });
  expect(calibration).toMatchObject({ showCalibration: true, isVisible: false, isReady: false });
  await advance(549);
  expect(calibration.isVisible).toBe(false);
  expect(timing).not.toHaveBeenCalled();
  await advance(1);
  expect(calibration).toMatchObject({ showCalibration: true, isVisible: true, isReady: false });
  expect(timing).toHaveBeenCalledWith(calibration.opacity, { toValue: 1, duration: 250, useNativeDriver: true });
  await advance(250);
  expect(calibration).toMatchObject({ showCalibration: false, isVisible: true, isReady: true });
});

test('skips the hold and crossfade with reduced motion after the selected-level frame', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  const timing = jest.spyOn(Animated, 'timing');
  await render('exercise-1');
  expect(calibration).toMatchObject({ showCalibration: true, isVisible: false, isReady: false });
  await advance(0);
  expect(calibration).toMatchObject({ showCalibration: false, isVisible: true, isReady: true });
  expect(timing).not.toHaveBeenCalled();
});

test('waits for the motion preference before starting the selected-level hold', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(null);
  await render('exercise-1');
  await advance(1000);
  expect(calibration).toMatchObject({ showCalibration: true, isVisible: false, isReady: false });
  jest.mocked(useReducedMotion).mockReturnValue(false);
  await act(async () => { tree!.update(<Probe exerciseId="exercise-1" />); });
  await advance(549);
  expect(calibration.isVisible).toBe(false);
  await advance(1);
  expect(calibration.isVisible).toBe(true);
});

test('reveals an exercise without a known difficulty without the hold or crossfade', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  await render('exercise-1', false, false);
  await advance(0);
  expect(calibration).toMatchObject({ showCalibration: false, isVisible: true, isReady: true });
  expect(timing).not.toHaveBeenCalled();
});

test('cancels the selected-level hold when unmounted', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  await render('exercise-1');
  await advance(200);
  await act(async () => { tree!.unmount(); });
  tree = undefined;
  await advance(1000);
  expect(timing).not.toHaveBeenCalled();
});
