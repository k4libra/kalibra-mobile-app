/**
 * Adaptive difficulty presentation mapping.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CalibrationState } from '@/types/calibration';
import type { ExerciseDto } from '@/types/api';

/** Shared presentation mapping of the server's adaptive difficulty. */
export const DIFFICULTY = {
  EASY: { level: 1, label: 'Nivel básico', state: 'low' },
  MEDIUM: { level: 2, label: 'Nivel intermedio', state: 'medium' },
  HARD: { level: 3, label: 'Nivel avanzado', state: 'high' },
} as const;

/** Resolves a supplied difficulty without inventing a missing level. */
export function calibrationState(difficulty: ExerciseDto['difficulty']): CalibrationState {
  return difficulty ? DIFFICULTY[difficulty].state : 'calibrating';
}
