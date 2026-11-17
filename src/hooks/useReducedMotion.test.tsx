/**
 * Native reduced-motion preference lifecycle tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AccessibilityInfo } from 'react-native';
import { useReducedMotion } from './useReducedMotion';

let tree: ReactTestRenderer.ReactTestRenderer | undefined;
let reduced: ReturnType<typeof useReducedMotion>;
let motionChanged: (value: boolean) => void;
let remove: jest.Mock;

function Probe() {
  reduced = useReducedMotion();
  return null;
}

async function render() {
  await act(async () => { tree = ReactTestRenderer.create(<Probe />); });
}

beforeEach(() => {
  jest.clearAllMocks();
  remove = jest.fn();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((event, listener) => {
    if (event === 'reduceMotionChanged') motionChanged = listener;
    return { remove };
  });
});

afterEach(async () => {
  await act(async () => { tree?.unmount(); });
  tree = undefined;
  jest.restoreAllMocks();
});

test.each([false, true])('starts unknown and reads the native reduced-motion value %s', async value => {
  let resolve!: (enabled: boolean) => void;
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockImplementation(() => new Promise(done => { resolve = done; }));
  await render();
  expect(reduced).toBeNull();
  expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalledTimes(1);
  await act(async () => { resolve(value); });
  expect(reduced).toBe(value);
});

test('updates when the native reduceMotionChanged listener fires', async () => {
  await render();
  expect(AccessibilityInfo.addEventListener).toHaveBeenCalledWith('reduceMotionChanged', expect.any(Function));
  expect(reduced).toBe(false);
  await act(async () => { motionChanged(true); });
  expect(reduced).toBe(true);
  await act(async () => { motionChanged(false); });
  expect(reduced).toBe(false);
});

test('keeps a live preference change when the initial native request resolves later', async () => {
  let resolve!: (enabled: boolean) => void;
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockImplementation(() => new Promise(done => { resolve = done; }));
  await render();
  await act(async () => { motionChanged(true); });
  await act(async () => { resolve(false); });
  expect(reduced).toBe(true);
});

test('unsubscribes on unmount and ignores a pending native result', async () => {
  let resolve!: (enabled: boolean) => void;
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockImplementation(() => new Promise(done => { resolve = done; }));
  await render();
  await act(async () => { tree!.unmount(); });
  tree = undefined;
  expect(remove).toHaveBeenCalledTimes(1);
  await act(async () => { resolve(false); motionChanged(true); });
  expect(reduced).toBeNull();
});

test('disables motion when the native preference cannot be read', async () => {
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockRejectedValue(new Error('Unavailable'));
  await render();
  expect(reduced).toBe(true);
});
