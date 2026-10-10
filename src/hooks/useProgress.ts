/**
 * Hook of the progress tab.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useState } from 'react';
import { coursesService } from '@/services/courses.service';
import { progressService } from '@/services/progress.service';
import type { EnrolledCourse } from '@/types/course';
import { useResource } from './useResource';

/**
 * Picks the course shown first: the one where the student solved the most exercises.
 *
 * @param courses - Enrolled courses.
 * @returns The id of the most practiced course, or `null` without courses.
 */
export function defaultProgressCourseId(courses: EnrolledCourse[]): string | null {
  if (courses.length === 0) return null;
  return courses.reduce((best, course) => (course.solvedExerciseCount > best.solvedExerciseCount ? course : best)).id;
}

/**
 * Loads the enrolled courses and the progress of the selected one.
 *
 * @returns The `courses`, the `selectedCourseId` with `selectCourse`, the course `progress`
 * (`null` while loading or without courses), and the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { courses, progress, selectCourse } = useProgress();
 * ```
 */
export function useProgress() {
  const coursesState = useResource(coursesService.listCourses, 'progress-courses');
  const courses = coursesState.data ?? [];
  const [chosenCourseId, setChosenCourseId] = useState<string | null>(null);
  const selectedCourseId =
    chosenCourseId && courses.some(course => course.id === chosenCourseId) ? chosenCourseId : defaultProgressCourseId(courses);

  const progressState = useResource(
    () => (selectedCourseId ? progressService.getCourseProgress(selectedCourseId) : Promise.resolve(null)),
    `progress-${selectedCourseId ?? 'none'}`,
  );

  return {
    courses,
    selectedCourseId,
    selectCourse: setChosenCourseId,
    progress: progressState.data?.course.id === selectedCourseId ? progressState.data : null,
    isLoading: coursesState.isLoading || (selectedCourseId !== null && progressState.isLoading),
    error: coursesState.error ?? progressState.error,
  };
}
