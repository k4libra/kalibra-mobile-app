/**
 * Maps verified exercises and recorded answers to practice views.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AttemptDto, CourseDto, ExerciseDto } from '@/types/api';
import type { PracticeExercise, PracticeResult } from '@/types/exercise';
import { splitStatement } from '@/utils/statement';

const DIFFICULTY_LEVEL = { EASY: 1, MEDIUM: 2, HARD: 3 };
/**
 * Maps statement and options using the API's A-D keys, without a fabricated session.
 *
 * @param dto - Verified statement and answer values ordered A through D.
 * @param course - Curriculum used to resolve the subtopic name.
 * @returns The exercise view model with unavailable session data set to null.
 *
 * @example
 * ```ts
 * mapExercise(exerciseDto, courseDto).options[0].id; // A
 * ```
 */
export function mapExercise(
  dto: ExerciseDto,
  course: CourseDto,
): PracticeExercise {
  return {
    id: dto.exerciseId,
    courseId: course.courseId,
    subtopicId: dto.subtopicId,
    subtopicName:
      course.subtopics.find(item => item.id === dto.subtopicId)?.name ?? '',
    area: course.name,
    levelLabel: '',
    difficultyLabel: dto.difficulty && DIFFICULTY_LEVEL[dto.difficulty]
      ? `Dificultad adaptativa: Nivel ${DIFFICULTY_LEVEL[dto.difficulty]}`
      : '',
    position: null,
    sessionSize: null,
    sessionPoints: null,
    elapsed: '',
    prompt: [{ text: dto.statement }],
    statementSegments: splitStatement(dto.statement),
    question: [],
    code: null,
    hint: '',
    options: dto.options.map((value, index) => ({
      id: String.fromCharCode(65 + index),
      letter: String.fromCharCode(65 + index),
      value,
      hint: '',
    })),
  };
}
/**
 * Maps signed mastery changes and the server explanation, including historical attempts without exercise IDs.
 *
 * @param dto - Recorded answer including signed percentage-point changes.
 * @param course - Curriculum that owns this attempt.
 * @param exerciseId - Original exercise identifier, or null for historical results.
 * @returns The recorded result and the unmodified server explanation.
 *
 * @example
 * ```ts
 * mapResult(attemptDto, courseDto).attemptId;
 * ```
 */
export function mapResult(
  dto: AttemptDto,
  course: CourseDto,
  exerciseId: string | null = null,
): PracticeResult {
  const isCorrect = dto.result === 'CORRECT';
  return {
    attemptId: dto.id,
    exerciseId,
    courseId: course.courseId,
    subtopicId: dto.subtopicId,
    subtopicName:
      course.subtopics.find(item => item.id === dto.subtopicId)?.name ?? '',
    isCorrect,
    message: isCorrect
      ? 'Tu respuesta es correcta.'
      : 'Revisa la explicación para seguir aprendiendo.',
    masteryDelta: dto.masteryChanged ? dto.masteryDeltaPoints : 0,
    position: null,
    sessionSize: null,
    sessionOutcomes: [],
    explanation: dto.explanation,
    explanationTag: '',
    steps: [],
    summaryLabel: '',
    summaryValue: '',
    tipTitle: '',
    tipBody: '',
  };
}
