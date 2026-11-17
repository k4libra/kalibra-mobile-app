/**
 * Adaptive practice service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PracticeContract } from '@/services/practice.contract';
import type { ExerciseDto, AttemptDto, CourseDto } from '@/types/api';
import type { PracticeResult } from '@/types/exercise';
import { apiClient, ApiError } from '@/services/http/apiClient';
import { getSessionRevision, subscribeSession } from '@/services/http/session';
import {
  getEnrolledCourse,
  listEnrolledCourses,
  getCourseHistory,
} from '@/services/http/studentData';
import { mapExercise, mapResult } from '@/services/mappers/practice';
const exercises = new Map<string, { course: CourseDto; exercise: ExerciseDto }>();
const results = new Map<string, PracticeResult>();
subscribeSession(() => {
  exercises.clear();
  results.clear();
});
/** Retrieves verified exercises, records answers once and restores past results from history. */
export const practiceService: PracticeContract = {
  /** {@inheritDoc PracticeContract.getNextExercise} */
  async getNextExercise(courseId, subtopicId, mode) {
    const revision = getSessionRevision();
    const course = await getEnrolledCourse(courseId);
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    const dto = await apiClient.post<ExerciseDto>('/practice-exercises', {
      courseId,
      ...(mode === 'EXPRESS' ? { mode } : { subtopicId }),
    });
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    exercises.set(dto.exerciseId, { course, exercise: dto });
    return mapExercise(dto, course);
  },
  /** {@inheritDoc PracticeContract.submitAnswer} */
  async submitAnswer(exerciseId, optionId, timeSpentSeconds) {
    const revision = getSessionRevision();
    const loaded = exercises.get(exerciseId);
    if (!loaded) throw new ApiError(404, 'NOT_FOUND');
    const { course, exercise } = loaded;
    const dto = await apiClient.post<AttemptDto>('/exercise-attempts', {
      courseId: course.courseId,
      exerciseId,
      selectedOptionKey: optionId,
      timeSpentSeconds,
    });
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    const result = mapResult(dto, course, exerciseId);
    const value = exercise.options[optionId.charCodeAt(0) - 65];
    if (!result.selectedAnswer && value !== undefined) result.selectedAnswer = { letter: optionId, value };
    results.set(dto.id, result);
    return result;
  },
  /** {@inheritDoc PracticeContract.getResult} */
  async getResult(attemptId) {
    const revision = getSessionRevision();
    const cached = results.get(attemptId);
    if (cached) return cached;
    const courses = await listEnrolledCourses();
    for (const course of courses) {
      const attempt = (await getCourseHistory(course.courseId)).content.find(
        item => item.id === attemptId,
      );
      if (revision !== getSessionRevision())
        throw new ApiError(401, 'UNAUTHORIZED');
      if (attempt) {
        const result = mapResult(attempt, course);
        results.set(attemptId, result);
        return result;
      }
    }
    throw new ApiError(404, 'NOT_FOUND');
  },
};
