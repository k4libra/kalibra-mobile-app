/**
 * Simulated adaptive practice endpoints with a sample exercise taken from the Figma mockups.
 *
 * @remarks
 * Every subtopic receives the same sample exercise labelled with its own name; the real service
 * returns exercises generated from the material of each subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PracticeContract } from '@/services/practice.contract';
import type { PracticeExercise, PracticeResult } from '@/types/exercise';
import { COURSES, SUBTOPICS } from './courses.mock';
import { respond } from './scenario';

// Option that answers the sample exercise correctly.
const CORRECT_OPTION_ID = 'opt-a';

/**
 * Builds the sample exercise for a subtopic.
 *
 * @param courseId - Course of the exercise.
 * @param subtopicId - Subtopic of the exercise.
 * @returns The sample exercise labelled with the subtopic and course names.
 */
export function sampleExercise(courseId: string, subtopicId: string): PracticeExercise {
  const subtopic = SUBTOPICS.find(item => item.id === subtopicId);
  const course = COURSES.find(item => item.id === courseId);
  return {
    id: `ex-${subtopicId}`,
    courseId,
    subtopicId,
    subtopicName: subtopic?.name ?? 'Subtema',
    area: (course?.name ?? 'Curso').toUpperCase(),
    levelLabel: 'NIVEL INTERMEDIO',
    difficultyLabel: 'Dificultad adaptativa: Nivel 2',
    position: 3,
    sessionSize: 5,
    sessionPoints: 45,
    elapsed: '01:42',
    prompt: [{ text: 'Dado el siguiente fragmento de código recursivo implementado en ' }, { text: 'Python', isCode: true }, { text: ':' }],
    code: {
      fileName: 'misterio.py',
      language: 'PYTHON 3',
      source: 'def misterio(n):\n    if n <= 1:\n        return 1\n    return n + misterio(n - 2)',
    },
    question: [{ text: '¿Cuál es el valor retornado al ejecutar ' }, { text: 'misterio(5)', isCode: true }, { text: '?' }],
    options: [
      { id: 'opt-a', letter: 'A', value: '9', hint: '5 + 3 + 1 (caso base alcanzado)' },
      { id: 'opt-b', letter: 'B', value: '15', hint: 'Suma gaussiana estándar 1..5' },
      { id: 'opt-c', letter: 'C', value: '8', hint: '5 + 3 sin suma del caso base' },
      { id: 'opt-d', letter: 'D', value: 'RecursionError', hint: 'Límite de recursión alcanzado' },
    ],
    hint: 'Escribe cada llamada en una pila: misterio(5) llama a misterio(3), que llama a misterio(1). ¿Qué retorna el caso base?',
  };
}

/**
 * Builds the result of answering the sample exercise.
 *
 * @param exerciseId - Exercise answered, in the form `ex-<subtopicId>`.
 * @param optionId - Option chosen by the student.
 * @returns The result with its explanation.
 */
export function sampleResult(exerciseId: string, optionId: string): PracticeResult {
  const subtopicId = exerciseId.replace(/^ex-/, '');
  const courseId = SUBTOPICS.find(item => item.id === subtopicId)?.courseId ?? '';
  const exercise = sampleExercise(courseId, subtopicId);
  const isCorrect = optionId === CORRECT_OPTION_ID;
  return {
    attemptId: `${exerciseId}:${optionId}`,
    exerciseId,
    courseId,
    subtopicId,
    subtopicName: exercise.subtopicName,
    isCorrect,
    message: isCorrect
      ? 'Has resuelto la llamada recursiva sin desbordar la pila de ejecución.'
      : 'Revisa el desenrollado: el caso base también aporta su valor a la suma.',
    masteryDelta: isCorrect ? 7 : 0,
    position: exercise.position,
    sessionSize: exercise.sessionSize,
    sessionOutcomes: [true, true, isCorrect],
    explanationTag: 'Pila LIFO',
    steps: [
      { order: 1, expression: 'misterio(5)', tag: 'Marco #1', description: 'Evalúa la bifurcación recursiva: 5 + misterio(3)', isKey: false },
      { order: 2, expression: 'misterio(3)', tag: 'Marco #2', description: 'Evalúa la llamada interna: 3 + misterio(1)', isKey: false },
      { order: 3, expression: 'misterio(1)', tag: 'Caso Base', description: 'Se alcanza la condición de parada: retorna 1', isKey: true },
    ],
    summaryLabel: 'Desenrollado total:',
    summaryValue: '5 + 3 + 1 = 9',
    tipTitle: isCorrect ? 'Clave de aprendizaje' : 'Dónde se rompió tu razonamiento',
    tipBody: isCorrect
      ? '¡Excelente comprensión del caso base y el desenrollado de la pila! Identificar temprano el criterio de parada evita la recursión infinita.'
      : 'El caso base retorna 1, no 0: por eso el total es 9 y no 8.',
  };
}

/**
 * Simulated implementation of {@link PracticeContract}.
 */
export const practiceMock: PracticeContract = {
  getNextExercise: (courseId, subtopicId) => respond(sampleExercise(courseId, subtopicId)),
  submitAnswer: (exerciseId, optionId) => respond(sampleResult(exerciseId, optionId)),
  getResult: attemptId => {
    const [exerciseId, optionId] = attemptId.split(':');
    return optionId ? respond(sampleResult(exerciseId, optionId)) : Promise.reject(new Error(`Attempt ${attemptId} not found`));
  },
};
