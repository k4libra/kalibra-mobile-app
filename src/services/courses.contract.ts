/**
 * Contract of the student courses endpoints, shared by the real and the simulated service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { EnrolledCourse, Student, StudentSubtopic } from '@/types/course';

/**
 * Operations the student app needs from the courses module of the backend.
 */
export interface CoursesContract {
  /** Fetches the profile and summary of the signed-in student. */
  getStudent: () => Promise<Student>;
  /** Lists the courses the student is enrolled in. */
  listCourses: () => Promise<EnrolledCourse[]>;
  /** Fetches one enrolled course; rejects when it does not exist. */
  getCourse: (courseId: string) => Promise<EnrolledCourse>;
  /** Lists the subtopics of a course with the mastery of the student, in order. */
  listSubtopics: (courseId: string) => Promise<StudentSubtopic[]>;
}
