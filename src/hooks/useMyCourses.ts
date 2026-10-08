/**
 * Hook of the courses screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service';
import { useResource } from './useResource';

/**
 * Loads the signed-in student and the courses they are enrolled in.
 *
 * @returns The `student` (`null` while loading), the `courses`, the `isLoading` and `error` state, and `refetch`.
 *
 * @example
 * ```tsx
 * const { student, courses } = useMyCourses();
 * ```
 */
export function useMyCourses() {
  const { data, isLoading, error, refetch } = useResource(
    () => Promise.all([coursesService.getStudent(), coursesService.listCourses()]),
    'my-courses',
  );
  return { student: data?.[0] ?? null, courses: data?.[1] ?? [], isLoading, error, refetch };
}
