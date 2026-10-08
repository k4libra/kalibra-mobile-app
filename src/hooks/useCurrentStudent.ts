/**
 * Hook that loads the signed-in student.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service';
import { useResource } from './useResource';

/**
 * Loads the profile and summary of the signed-in student shown in headers and greetings.
 *
 * @returns The `student` (`null` while loading), the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { student } = useCurrentStudent();
 * ```
 */
export function useCurrentStudent() {
  const { data, isLoading, error } = useResource(coursesService.getStudent, 'student');
  return { student: data, isLoading, error };
}
