import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AppState, type AppStateStatus } from 'react-native';
import { useExerciseTimer } from './useExerciseTimer';

jest.useFakeTimers();

let tree: ReactTestRenderer.ReactTestRenderer | undefined;
let timer: ReturnType<typeof useExerciseTimer>;
let stateListener: ((state: AppStateStatus) => void) | undefined;
let removeListener: jest.Mock;
let originalState: PropertyDescriptor | undefined;

function Probe({ exerciseId }: { exerciseId?: string }) {
  timer = useExerciseTimer(exerciseId);
  return null;
}

async function renderTimer(exerciseId?: string) {
  await act(async () => { tree = ReactTestRenderer.create(<Probe exerciseId={exerciseId} />); });
}
async function advance(milliseconds: number) {
  await act(async () => { jest.advanceTimersByTime(milliseconds); });
}

beforeEach(() => {
  jest.setSystemTime(new Date('2026-11-14T12:00:00Z'));
  originalState = Object.getOwnPropertyDescriptor(AppState, 'currentState');
  Object.defineProperty(AppState, 'currentState', { configurable: true, writable: true, value: 'active' });
  removeListener = jest.fn();
  stateListener = undefined;
  jest.spyOn(AppState, 'addEventListener').mockImplementation((event, listener) => {
    if (event === 'change') stateListener = listener;
    return { remove: removeListener };
  });
});
afterEach(async () => {
  if (tree) await act(async () => { tree!.unmount(); });
  tree = undefined;
  if (originalState) Object.defineProperty(AppState, 'currentState', originalState);
  jest.restoreAllMocks();
  jest.clearAllTimers();
});

test('excludes generation time and formats active exercise time across minutes', async () => {
  await renderTimer();
  await advance(120000);
  expect(timer.elapsed).toBe('00:00');
  await act(async () => { tree!.update(<Probe exerciseId="exercise-1" />); });
  await advance(65000);
  expect(timer.elapsed).toBe('01:05');
});

test('pauses without adding elapsed time and resumes from the existing total', async () => {
  await renderTimer('exercise-1');
  await advance(4000);
  expect(timer.elapsed).toBe('00:04');
  await act(async () => { timer.togglePause(); });
  expect(timer.isPaused).toBe(true);
  await advance(60000);
  expect(timer.elapsed).toBe('00:04');
  await act(async () => { timer.togglePause(); });
  expect(timer.isPaused).toBe(false);
  await advance(3000);
  expect(timer.elapsed).toBe('00:07');
});

test('excludes inactive and background time, then resumes only when active', async () => {
  await renderTimer('exercise-1');
  await advance(3000);
  await act(async () => { stateListener!('inactive'); });
  await advance(20000);
  expect(timer.elapsed).toBe('00:03');
  await act(async () => { stateListener!('background'); });
  await advance(40000);
  expect(timer.elapsed).toBe('00:03');
  await act(async () => { stateListener!('active'); });
  await advance(2000);
  expect(timer.elapsed).toBe('00:05');
});

test('resets both elapsed time and pause state when another exercise loads', async () => {
  await renderTimer('exercise-1');
  await advance(10000);
  await act(async () => { timer.togglePause(); });
  expect(timer.elapsed).toBe('00:10');
  await act(async () => { tree!.update(<Probe exerciseId="exercise-2" />); });
  expect(timer.elapsed).toBe('00:00');
  expect(timer.isPaused).toBe(false);
  await advance(3000);
  expect(timer.elapsed).toBe('00:03');
});

test('removes the app-state subscription and timer when unmounted', async () => {
  const intervals = jest.spyOn(globalThis, 'setInterval');
  const clear = jest.spyOn(globalThis, 'clearInterval');
  await renderTimer('exercise-1');
  await advance(2000);
  const clockId = intervals.mock.results.find((result, index) => result.type === 'return' && intervals.mock.calls[index][1] === 1000)?.value;
  expect(clockId).toBeDefined();
  await act(async () => { tree!.unmount(); });
  tree = undefined;
  expect(removeListener).toHaveBeenCalledTimes(1);
  expect(clear).toHaveBeenCalledWith(clockId);
  await advance(60000);
  expect(timer.elapsed).toBe('00:02');
});

test('snapshots full active seconds between interval ticks across pauses and background changes', async () => {
  await renderTimer('exercise-1');
  await advance(1600);
  expect(timer.getTimeSpentSeconds()).toBe(1);
  await act(async () => { timer.togglePause(); });
  await advance(20000);
  expect(timer.getTimeSpentSeconds()).toBe(1);
  await act(async () => { timer.togglePause(); });
  await advance(600);
  expect(timer.getTimeSpentSeconds()).toBe(2);
  await act(async () => { stateListener!('background'); });
  await advance(60000);
  expect(timer.getTimeSpentSeconds()).toBe(2);
  await act(async () => { stateListener!('active'); });
  await advance(800);
  expect(timer.getTimeSpentSeconds()).toBe(3);
});

test('sends zero before generation and caps active duration at the contract limit', async () => {
  await renderTimer();
  await advance(10000);
  expect(timer.getTimeSpentSeconds()).toBe(0);
  await act(async () => { tree!.update(<Probe exerciseId="exercise-1" />); });
  await advance(3601500);
  expect(timer.getTimeSpentSeconds()).toBe(3600);
});
