/**
 * Simulated progress endpoints with sample data taken from the Figma mockups.
 *
 * @remarks
 * Progress is derived from the shared course and subtopic fixtures, so the same mastery appears in
 * Cursos, Subtemas and Progreso. History attempt ids follow the practice mock format
 * (`ex-<subtopicId>:<optionId>`), so each entry opens a real simulated result.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { ProgressContract } from '@/services/progress.contract';
import type { CourseProgress, HistoryEntry, PracticeHistory } from '@/types/progress';
import { LOW_MASTERY_THRESHOLD } from '@/utils/mastery';
import { COURSES, SUBTOPICS } from './courses.mock';
import { isEmptyScenario, respond } from './scenario';
import { hasDemoSession } from './session.mock';

/**
 * Right and submitted answers of the demo student per subtopic.
 */
export const SUBTOPIC_ANSWERS: Record<string, { correctCount: number; attemptCount: number }> = {
  'sub-1': { correctCount: 14, attemptCount: 18 },
  'sub-2': { correctCount: 12, attemptCount: 14 },
  'sub-3': { correctCount: 4, attemptCount: 10 },
  'sub-5': { correctCount: 9, attemptCount: 11 },
  'sub-6': { correctCount: 5, attemptCount: 7 },
  'sub-7': { correctCount: 2, attemptCount: 3 },
  'sub-8': { correctCount: 0, attemptCount: 0 },
  'sub-9': { correctCount: 4, attemptCount: 4 },
  'sub-10': { correctCount: 4, attemptCount: 5 },
  'sub-11': { correctCount: 2, attemptCount: 3 },
  'sub-12': { correctCount: 1, attemptCount: 2 },
};

/**
 * Practice suggested for each subtopic when it needs urgent reinforcement.
 */
export const FOCUS_MESSAGES: Record<string, string> = {
  'sub-3': 'Recomendamos 3 ejercicios guiados hoy para consolidar memoización y formulación de estados.',
};

/**
 * Recent recorded answers of the demo student.
 */
export const HISTORY_ENTRIES: HistoryEntry[] = [
  { attemptId: 'ex-sub-1:opt-a', subtopicName: 'Recursividad y Backtracking', title: 'Evaluación de función recursiva misterio(n)', result: 'correct', isPendingReview: false, answeredAt: 'Hoy, 10:45 AM', isRecent: true, duration: '1m 42s' },
  { attemptId: 'ex-sub-3:opt-c', subtopicName: 'Programación Dinámica', title: 'Matriz de subsecuencia común más larga (LCS)', result: 'incorrect', isPendingReview: true, answeredAt: 'Ayer, 16:20 PM', isRecent: true, duration: '4m 10s' },
  { attemptId: 'ex-sub-2:opt-a', subtopicName: 'Árboles Binarios de Búsqueda', title: 'Rotación simple a la derecha en árbol AVL', result: 'correct', isPendingReview: false, answeredAt: '12 Oct, 18:05 PM', isRecent: false, duration: null },
];

// Totals of the whole history of the demo student, of which only the latest entries are listed.
const DEMO_SUMMARY = { total: 42, correct: 31, incorrect: 11 };

// Practice advice shown under a filtered history.
const ADVICE = 'Repasa hoy los ejercicios marcados como pendientes y vuelve a intentarlos en dos días: espaciar la práctica fija mejor lo aprendido.';

/**
 * Builds the progress of the demo student in a course from the shared fixtures.
 *
 * @param courseId - Enrolled course.
 * @returns The course progress, or `null` when the course is not enrolled.
 */
export function buildCourseProgress(courseId: string): CourseProgress | null {
  const course = COURSES.find(item => item.id === courseId);
  if (!course) return null;
  const empty = isEmptyScenario();
  const subtopics = SUBTOPICS.filter(item => item.courseId === courseId)
    .map(subtopic => ({
      ...subtopic,
      mastery: empty ? null : subtopic.mastery,
      ...(empty ? { correctCount: 0, attemptCount: 0 } : SUBTOPIC_ANSWERS[subtopic.id] ?? { correctCount: 0, attemptCount: 0 }),
    }))
    .sort((a, b) => (b.mastery ?? -1) - (a.mastery ?? -1));
  const weakest = [...subtopics].reverse().find(item => item.mastery !== null && item.mastery < LOW_MASTERY_THRESHOLD);
  return {
    course: empty ? { ...course, mastery: null, solvedExerciseCount: 0, masteredSubtopicCount: 0 } : course,
    subtopics,
    practicedSubtopicCount: subtopics.filter(item => item.attemptCount > 0).length,
    focus:
      weakest && weakest.mastery !== null
        ? {
            subtopicId: weakest.id,
            subtopicName: weakest.name,
            mastery: weakest.mastery,
            message: FOCUS_MESSAGES[weakest.id] ?? `Practica ejercicios guiados de ${weakest.name} para subir tu dominio.`,
          }
        : null,
  };
}

/**
 * Simulated implementation of {@link ProgressContract}.
 */
export const progressMock: ProgressContract = {
  getCourseProgress: courseId => {
    const progress = hasDemoSession() ? buildCourseProgress(courseId) : null;
    return progress ? respond(progress) : Promise.reject(new Error(`Course ${courseId} not enrolled`));
  },
  getHistory: () => {
    const hasActivity = hasDemoSession() && !isEmptyScenario();
    const history: PracticeHistory = hasActivity
      ? { summary: DEMO_SUMMARY, entries: HISTORY_ENTRIES, advice: ADVICE }
      : { summary: { total: 0, correct: 0, incorrect: 0 }, entries: [], advice: ADVICE };
    return respond(history);
  },
};
