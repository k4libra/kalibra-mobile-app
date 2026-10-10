/**
 * Courses service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CoursesContract } from '@/services/courses.contract';
import type { MasteryDto, UserDto, PendingInvitationDto } from '@/types/api';
import { apiClient } from '@/services/http/apiClient';
import { getSession } from '@/services/http/session';
import {
  listEnrolledCourses,
  getEnrolledCourse,
  getProgress,
} from '@/services/http/studentData';
import {
  averageMastery,
  mapCourse,
  mapSubtopics,
} from '@/services/mappers/courses';
/** Reads student identity, enrolled courses and measured subtopic progress. */
export const coursesService: CoursesContract = {
  /** {@inheritDoc CoursesContract.getStudent} */
  async getStudent() {
    const session = getSession();
    const [courses, invitations, user] = await Promise.all([
      coursesService.listCourses(),
      apiClient.get<PendingInvitationDto[]>('/invitations?status=PENDING'),
      session
        ? Promise.resolve(session.user)
        : apiClient.get<UserDto>('/users/me'),
    ]);
    const firstName =
      'firstName' in user ? user.firstName : user.fullName.split(/\s+/)[0];
    return {
      firstName,
      term: '',
      avatar: undefined,
      solvedExerciseCount: courses.reduce(
        (sum, course) => sum + course.solvedExerciseCount,
        0,
      ),
      averageMastery:
        averageMastery(courses.map(course => course.mastery)) ?? 0,
      pendingInvitationCount: invitations.filter(
        item => Date.parse(item.expiresAt) > Date.now(),
      ).length,
    };
  },
  /** {@inheritDoc CoursesContract.listCourses} */
  async listCourses() {
    const courses = await listEnrolledCourses();
    return Promise.all(
      courses.map(async course =>
        mapCourse(course, await getProgress(course.courseId)),
      ),
    );
  },
  /** {@inheritDoc CoursesContract.getCourse} */
  async getCourse(courseId) {
    return mapCourse(
      await getEnrolledCourse(courseId),
      await getProgress(courseId),
    );
  },
  /** {@inheritDoc CoursesContract.listSubtopics} */
  async listSubtopics(courseId) {
    const [course, progress, masteries] = await Promise.all([
      getEnrolledCourse(courseId),
      getProgress(courseId),
      apiClient.get<MasteryDto[]>(
        `/subtopic-masteries?courseId=${encodeURIComponent(courseId)}`,
      ),
    ]);
    return mapSubtopics(course, progress, masteries);
  },
};
