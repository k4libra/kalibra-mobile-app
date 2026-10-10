/**
 * Reads enrolled curriculum, progress and complete paginated attempt history.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { apiClient } from '@/services/http/apiClient';
import type { CourseDto, HistoryDto, ProgressDto } from '@/types/api';
import type { HistoryFilter } from '@/types/progress';
/**
 * Reads enrollment metadata without requesting progress for every course.
 *
 * @returns Enrollment metadata from the student API.
 * @throws ApiError when the session or backend is unavailable.
 */
export function listEnrolledCourses(): Promise<CourseDto[]> {
  return apiClient.get('/students/me/courses');
}
/**
 * Reads one enrolled course and rejects unavailable identities.
 *
 * @param courseId - Identifier of a currently enrolled course.
 * @returns The matching curriculum.
 * @throws Error when the course is not enrolled, or ApiError on HTTP failure.
 */
export async function getEnrolledCourse(courseId: string): Promise<CourseDto> {
  const course = (await listEnrolledCourses()).find(
    item => item.courseId === courseId,
  );
  if (!course) throw new Error('No se encontró el curso.');
  return course;
}
/**
 * Reads exact subtopic percentages for one enrolled course.
 *
 * @param courseId - Identifier of a currently enrolled course.
 * @returns Exact percentages and activity state.
 * @throws ApiError when access is denied or the backend is unavailable.
 */
export function getProgress(courseId: string): Promise<ProgressDto> {
  return apiClient.get(
    `/courses/${encodeURIComponent(courseId)}/student-progress`,
  );
}
const FILTERS: Record<HistoryFilter, HistoryDto['activeFilter']> = {
  all: 'ALL',
  correct: 'CORRECT',
  review: 'INCORRECT',
};
/**
 * Reads every page of a course history, retaining the server's independent totals.
 *
 * @param courseId - Enrolled course whose attempts are requested.
 * @param filter - Outcome filter sent to every history page.
 * @returns All matching entries and whole-course totals counted once.
 * @throws ApiError if any page cannot be loaded.
 */
export async function getCourseHistory(
  courseId: string,
  filter: HistoryFilter = 'all',
): Promise<HistoryDto> {
  const path = `/exercise-attempts?courseId=${encodeURIComponent(
    courseId,
  )}&result=${FILTERS[filter]}`;
  const first = await apiClient.get<HistoryDto>(`${path}&page=0&size=100`);
  const content = [...first.content];
  for (let page = 1; page < first.totalPages; page += 1) {
    content.push(
      ...(await apiClient.get<HistoryDto>(`${path}&page=${page}&size=100`))
        .content,
    );
  }
  return { ...first, content };
}
