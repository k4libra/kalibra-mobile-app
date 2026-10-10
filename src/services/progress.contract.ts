/**
 * Contract of the progress endpoints, shared by the real and the simulated service.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { CourseProgress, PracticeHistory } from '@/types/progress';

/**
 * Operations the student app needs to show progress and practice history.
 */
export interface ProgressContract {
  /** Fetches the progress of the signed-in student in one enrolled course; rejects for an unknown course. */
  getCourseProgress: (courseId: string) => Promise<CourseProgress>;
  /** Fetches the practice history of the signed-in student; empty when nothing was answered yet. */
  getHistory: () => Promise<PracticeHistory>;
}
