/**
 * Progress service used by the hooks.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { ProgressContract } from '@/services/progress.contract';
import {
  getEnrolledCourse,
  listEnrolledCourses,
  getProgress,
  getCourseHistory,
} from '@/services/http/studentData';
import { mapProgress } from '@/services/mappers/courses';
import { mapHistoryEntry } from '@/services/mappers/history';
/** Reads course progress and aggregates filtered history across enrolled courses. */
export const progressService: ProgressContract = {
  /** {@inheritDoc ProgressContract.getCourseProgress} */
  async getCourseProgress(courseId) {
    const [course, progress] = await Promise.all([
      getEnrolledCourse(courseId),
      getProgress(courseId),
    ]);
    return mapProgress(course, progress);
  },
  /** {@inheritDoc ProgressContract.getHistory} */
  async getHistory(filter = 'all') {
    const courses = await listEnrolledCourses();
    const histories = await Promise.all(
      courses.map(async course => ({
        course,
        history: await getCourseHistory(course.courseId, filter),
      })),
    );
    const entries = histories
      .flatMap(({ course, history }) =>
        history.content.map(dto => ({ dto, course })),
      )
      .sort(
        (a, b) => Date.parse(b.dto.answeredAt) - Date.parse(a.dto.answeredAt),
      )
      .map(({ dto, course }) => mapHistoryEntry(dto, course));
    return {
      entries,
      summary: histories.reduce(
        (sum, { history }) => ({
          total: sum.total + history.allCount,
          correct: sum.correct + history.correctCount,
          incorrect: sum.incorrect + history.incorrectCount,
        }),
        { total: 0, correct: 0, incorrect: 0 },
      ),
      advice:
        'Repasa las explicaciones y refuerza los subtemas que necesitas practicar.',
    };
  },
};
