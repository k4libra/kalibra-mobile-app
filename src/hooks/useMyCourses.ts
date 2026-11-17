/**
 * Hook of the courses screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useMemo } from 'react';
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
    true,
  );
  const courses = data?.[1];
  const recommendation = useMemo(() => {
    const available = courses ?? [];
    // Resume the practiced course that needs the most reinforcement, then its weakest subtopic.
    const practiced = available.filter(course => course.solvedExerciseCount > 0);
    const featuredCourse = [...(practiced.length ? practiced : available)]
      .sort((a, b) => (a.mastery ?? -1) - (b.mastery ?? -1))[0] ?? null;
    return { featuredCourse, quickPractice: featuredCourse
      ? { courseId: featuredCourse.id, mode: 'EXPRESS' as const }
      : null };
  }, [courses]);
  return { student: data?.[0] ?? null, courses: courses ?? [], ...recommendation, isLoading, error, refetch };
}
