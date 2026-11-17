/**
 * Exercise screen calibration lifecycle tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AccessibilityInfo, Animated, AppState } from 'react-native';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { useExercise } from '@/hooks/usePractice';
import { mapExercise } from '@/services/mappers/practice';
import { TEST_COURSES } from '@/test/apiFixtures';
import { CalibrationGauge, ExerciseCalibration } from '@/components/practice';
import { LoadingState } from '@/components/ui';
import { ScreenContainer } from '@/components/layout';
import type { RootScreenProps } from '@/navigation/types';
import type { ExerciseDto } from '@/types/api';
import { hasText } from '../appSupport';

jest.mock('@/hooks/usePractice', () => ({ useExercise: jest.fn() }));
jest.mock('@/hooks/useCurrentStudent', () => ({ useCurrentStudent: () => ({ student: null }) }));
jest.mock('@/context/PracticeContext', () => ({ usePracticeSession: () => ({ session: null }) }));
jest.useFakeTimers();
let tree: ReactTestRenderer.ReactTestRenderer | undefined;
let props: RootScreenProps<'Exercise'>;
let resource: ReturnType<typeof useExercise>;
let stateDescriptor: PropertyDescriptor | undefined;
const submit = jest.fn();

beforeEach(() => {
  stateDescriptor = Object.getOwnPropertyDescriptor(AppState, 'currentState');
  Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active' });
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  resource = { exercise: null, submit, isLoading: true, isSubmitting: false, isEmpty: false, error: null };
  jest.mocked(useExercise).mockImplementation(() => resource);
  props = { navigation: { navigate: jest.fn(), replace: jest.fn(), goBack: jest.fn() }, route: { key: 'Exercise', name: 'Exercise', params: { courseId: 'course-1', subtopicId: 'sub-1', calibration: { name: 'Recursividad', mastery: 55 } } } } as unknown as RootScreenProps<'Exercise'>;
});
afterEach(async () => {
  await act(async () => { tree?.unmount(); });
  tree = undefined;
  if (stateDescriptor) Object.defineProperty(AppState, 'currentState', stateDescriptor);
  jest.restoreAllMocks();
  jest.clearAllTimers();
  submit.mockReset();
});
async function render() {
  await act(async () => { tree = ReactTestRenderer.create(<ExerciseScreen {...props} />); });
}
async function advance(ms: number) {
  await act(async () => { jest.advanceTimersByTime(ms); });
}
async function arrive(difficulty?: ExerciseDto['difficulty']) {
  resource = { ...resource, isLoading: false, exercise: { ...mapExercise({ exerciseId: 'exercise-sub-1', subtopicId: 'sub-1', statement: 'Evalúa la suma de 5, 3 y 1.', options: ['9', '8', '7', '6'], difficulty }, TEST_COURSES[0]), position: 1, sessionSize: 5 } };
  await act(async () => { tree!.update(<ExerciseScreen {...props} />); });
}

test.each([['EASY', 'low', 'básico'], ['MEDIUM', 'medium', 'intermedio'], ['HARD', 'high', 'avanzado']] as const)('calibrates, settles %s and crossfades into the exercise', async (difficulty, state, label) => {
  await render();
  expect(hasText(tree!.root, 'Calibrando tu ejercicio')).toBe(true);
  expect(hasText(tree!.root, 'Revisando tu dominio en Recursividad')).toBe(true);
  expect(tree!.root.findAllByType(LoadingState)).toHaveLength(0);
  expect(tree!.root.findByType(ScreenContainer).props.footer).toBeFalsy();
  await arrive(difficulty);
  expect(tree!.root.findByType(CalibrationGauge).props.state).toBe(state);
  expect(hasText(tree!.root, `Nivel ${label} elegido para ti`)).toBe(true);
  expect(hasText(tree!.root, `Tu dominio en ${resource.exercise!.subtopicName} es 55 %`)).toBe(true);
  await advance(549);
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(false);
  await advance(1);
  // As in the Figma calibration frames, the submit tray stays hidden until the crossfade ends.
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(false);
  await advance(250);
  expect(tree!.root.findAllByType(ExerciseCalibration)).toHaveLength(0);
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(true);
  expect(hasText(tree!.root, '00:00')).toBe(true);
});

test('keeps the express subtopic unknown until the exercise arrives', async () => {
  props = { ...props, route: { ...props.route, params: { courseId: 'course-1', mode: 'EXPRESS' } } };
  await render();
  expect(hasText(tree!.root, 'Buscando tu subtema más débil')).toBe(true);
  expect(tree!.root.findByType(ExerciseCalibration).props.subtopic).toBeUndefined();
  await arrive('MEDIUM');
  expect(tree!.root.findByType(ExerciseCalibration).props.mastery).toBeUndefined();
  expect(tree!.root.findByType(ExerciseCalibration).props.subtopic).toBe(resource.exercise!.subtopicName);
  expect(hasText(tree!.root, `Tu dominio en ${resource.exercise!.subtopicName} es 0 %`)).toBe(false);
});

test('shows the generation caption only after six seconds and never extends a settled state', async () => {
  await render();
  await advance(5999);
  expect(hasText(tree!.root, 'Creando y verificando tu ejercicio')).toBe(false);
  await advance(1);
  expect(hasText(tree!.root, 'Creando y verificando tu ejercicio')).toBe(true);
  await arrive('MEDIUM');
  expect(hasText(tree!.root, 'Creando y verificando tu ejercicio')).toBe(false);
});

test('renders a static settle frame then shows the exercise immediately with reduced motion', async () => {
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValue(true);
  const loop = jest.spyOn(Animated, 'loop');
  const timing = jest.spyOn(Animated, 'timing');
  await render();
  await arrive('MEDIUM');
  expect(hasText(tree!.root, 'Nivel intermedio elegido para ti')).toBe(true);
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(false);
  await advance(0);
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(true);
  expect(tree!.root.findAllByType(ExerciseCalibration)).toHaveLength(0);
  expect(loop).not.toHaveBeenCalled();
  expect(timing).not.toHaveBeenCalled();
});

test('starts the answer timer after visibility, excluding generation, settling and crossfade', async () => {
  await render();
  await advance(10000);
  await arrive('MEDIUM');
  await advance(550);
  expect(hasText(tree!.root, '00:00')).toBe(true);
  await advance(250);
  await advance(999);
  expect(hasText(tree!.root, '00:00')).toBe(true);
  await advance(1);
  expect(hasText(tree!.root, '00:01')).toBe(true);
  const option = tree!.root.findAll(node => typeof node.props.onPress === 'function' && /^Opción A/.test(node.props.accessibilityLabel ?? ''))[0];
  await act(async () => { option.props.onPress(); });
  const button = tree!.root.findAll(node => typeof node.props.onPress === 'function' && node.props.accessibilityLabel === 'Enviar respuesta')[0];
  await act(async () => { button.props.onPress(); });
  expect(submit).toHaveBeenCalledWith(resource.exercise!.id, 'A', 1);
});

test.each([false, true])('preserves error and empty states (empty=%s) without calibration or footer', async isEmpty => {
  await render();
  resource = { ...resource, isLoading: false, error: isEmpty ? 'No hay ejercicios disponibles.' : 'Inténtalo más tarde.', isEmpty };
  await act(async () => { tree!.update(<ExerciseScreen {...props} />); });
  expect(hasText(tree!.root, resource.error!)).toBe(true);
  expect(tree!.root.findAllByType(ExerciseCalibration)).toHaveLength(0);
  expect(tree!.root.findByType(ScreenContainer).props.footer).toBeFalsy();
});

test('does not invent a difficulty or mastery when the server omits them', async () => {
  props = { ...props, route: { ...props.route, params: { courseId: 'course-1', subtopicId: 'sub-1', calibration: { name: 'Recursividad', mastery: null } } } };
  await render();
  await arrive();
  expect(hasText(tree!.root, 'Nivel intermedio elegido para ti')).toBe(false);
  await advance(0);
  expect(tree!.root.findAllByType(ExerciseCalibration)).toHaveLength(0);
  expect(hasText(tree!.root, 'Nivel adaptativo')).toBe(true);
});

test.each([200, 550, 800])('honors a live reduced-motion change at %s ms without replaying the hold', async elapsed => {
  const listeners: ((value: boolean) => void)[] = [];
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((event, listener) => {
    if (event === 'reduceMotionChanged') listeners.push(listener);
    return { remove: jest.fn() };
  });
  await render();
  await arrive('MEDIUM');
  await advance(elapsed);
  await act(async () => { listeners.forEach(listener => listener(true)); });
  await advance(0);
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(true);
  expect(tree!.root.findAllByType(ExerciseCalibration)).toHaveLength(0);
  await act(async () => { listeners.forEach(listener => listener(false)); });
  await advance(0);
  expect(tree!.root.findAllByType(ExerciseCalibration)).toHaveLength(0);
  expect(hasText(tree!.root, 'Enviar respuesta')).toBe(true);
});
