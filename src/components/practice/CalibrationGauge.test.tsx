/**
 * Calibration dial rendering and motion tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import { Path } from 'react-native-svg';
import { CalibrationGauge } from './CalibrationGauge';
import type { CalibrationState } from '@/types/calibration';

jest.useFakeTimers();
let tree: ReactTestRenderer.ReactTestRenderer | undefined;
let motionChanged: (value: boolean) => void;
let remove: jest.Mock;

beforeEach(() => {
  remove = jest.fn();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((event, listener) => {
    if (event === 'reduceMotionChanged') motionChanged = listener;
    return { remove };
  });
});
afterEach(async () => {
  await act(async () => { tree?.unmount(); });
  tree = undefined;
  jest.restoreAllMocks();
  jest.clearAllTimers();
});
async function render(state: CalibrationState, mastery?: number, caption?: string) {
  await act(async () => { tree = ReactTestRenderer.create(<CalibrationGauge state={state} mastery={mastery} caption={caption} />); });
}
function rotation() {
  const needle = tree!.root.findAll(node => typeof node.type === 'string' && node.props.testID === 'calibration-needle')[0];
  return StyleSheet.flatten(needle.props.style).transform[0].rotate;
}

test.each([
  ['calibrating', 'Calibrando', '-90deg', [0.35, 0.35, 0.35]],
  ['low', 'Nivel básico', '-144deg', [1, 0.22, 0.22]],
  ['medium', 'Nivel intermedio', '-81deg', [0.22, 1, 0.22]],
  ['high', 'Nivel avanzado', '-27deg', [0.22, 0.22, 1]],
] as const)('renders %s geometry, opacity, caption and static needle', async (state, caption, angle, opacities) => {
  await render(state);
  expect(tree!.root.findAll(node => String(node.type) === 'Text' && node.props.children === caption)).toHaveLength(1);
  expect(tree!.root.findAll(node => node.props.accessibilityRole === 'progressbar')[0].props.accessibilityLabel).toBe(caption);
  expect(rotation()).toBe(angle);
  expect(tree!.root.findAllByType(Path).map(path => path.props.opacity)).toEqual(opacities);
  expect(tree!.root.findAllByType(Path).every(path => path.props.strokeWidth === 16 && path.props.strokeLinecap === 'butt')).toBe(true);
});

test.each([[0, '-180deg'], [55, '-81deg'], [100, '0deg'], [-10, '-180deg'], [120, '0deg']] as const)('places known mastery %s directly without motion', async (mastery, angle) => {
  await render('medium', mastery);
  expect(rotation()).toBe(angle);
});

test('does not start an animation loop while the motion preference is unknown or reduced', async () => {
  let resolve!: (value: boolean) => void;
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockImplementation(() => new Promise(done => { resolve = done; }));
  const loop = jest.spyOn(Animated, 'loop');
  await render('calibrating');
  expect(loop).not.toHaveBeenCalled();
  await act(async () => { resolve(true); });
  expect(loop).not.toHaveBeenCalled();
  expect(rotation()).toBe('-90deg');
});

test('sweeps in 1.2 seconds, settles in 400 ms and stops when reduced motion changes', async () => {
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValue(false);
  const stop = jest.fn();
  const loop = jest.spyOn(Animated, 'loop').mockReturnValue({ start: jest.fn(), stop, reset: jest.fn() });
  const timing = jest.spyOn(Animated, 'timing');
  await render('calibrating');
  expect(loop).toHaveBeenCalledTimes(1);
  expect(timing).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 55, duration: 600 }));
  expect(timing).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 125, duration: 600 }));
  await act(async () => { tree!.update(<CalibrationGauge state="high" />); });
  expect(stop).toHaveBeenCalled();
  expect(timing).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 27, duration: 400 }));
  await act(async () => { motionChanged(true); });
  expect(rotation()).toBe('-27deg');
  await act(async () => { tree!.unmount(); });
  tree = undefined;
  expect(remove).toHaveBeenCalledTimes(1);
});

test('announces the visible screen caption and measured mastery', async () => {
  await render('medium', 55, 'Tu dominio en Recursividad es 55 %');
  const progress = tree!.root.findAll(node => node.props.accessibilityRole === 'progressbar')[0];
  expect(progress.props.accessibilityLabel).toBe('Tu dominio en Recursividad es 55 %');
  expect(progress.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 55 });
});
