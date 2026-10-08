/**
 * Hook of the course subtopics screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service';
import { useResource } from './useResource';

/**
 * Loads an enrolled course and its subtopics with the mastery of the student.
 *
 * @param courseId - Course to load.
 * @returns The `course` (`null` while loading), its `subtopics`, the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { course, subtopics } = useCourseSubtopics(courseId);
 * ```
 */
export function useCourseSubtopics(courseId: string) {
  const { data, isLoading, error } = useResource(
    () => Promise.all([coursesService.getCourse(courseId), coursesService.listSubtopics(courseId)]),
    `subtopics-${courseId}`,
  );
  return { course: data?.[0] ?? null, subtopics: data?.[1] ?? [], isLoading, error };
}
