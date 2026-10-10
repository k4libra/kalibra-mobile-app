/**
 * Domain types of the academic progress and practice history of a student.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { EnrolledCourse, StudentSubtopic } from './course';

/**
 * Describes a subtopic with the mastery and answer counts of the student.
 */
export interface SubtopicProgress extends StudentSubtopic {
  /** Correct answers; null when the API only supplies the total solved count. */
  correctCount: number | null;
  /** Answers the student submitted in the subtopic. */
  attemptCount: number;
}

/**
 * Describes the subtopic that most needs reinforcement and what to practice.
 */
export interface FocusRecommendation {
  /** Subtopic to reinforce. */
  subtopicId: string;
  /** Name of the subtopic. */
  subtopicName: string;
  /** Mastery of the student in the subtopic, from 0 to 100. */
  mastery: number;
  /** Suggested practice for the subtopic. */
  message: string;
}

/**
 * Describes the progress of the student in one enrolled course.
 */
export interface CourseProgress {
  /** Whether the API reports submitted answers for this course. */
  hasActivity: boolean;
  /** Course of the progress. */
  course: EnrolledCourse;
  /** Subtopics ordered from the highest to the lowest mastery. */
  subtopics: SubtopicProgress[];
  /** Subtopics with at least one submitted answer. */
  practicedSubtopicCount: number;
  /** Lowest-mastery subtopic below the low threshold; `null` when none needs urgent reinforcement. */
  focus: FocusRecommendation | null;
}

/**
 * Outcome of a recorded answer.
 */
export type AttemptResult = 'correct' | 'incorrect';

/**
 * Subset of history shown by the filter tabs.
 *
 * @remarks
 * - `all`: every recorded answer.
 * - `correct`: only right answers.
 * - `review`: only wrong answers, which the student should review.
 */
export type HistoryFilter = 'all' | 'correct' | 'review';

/**
 * Describes one recorded answer of the practice history.
 */
export interface HistoryEntry {
  /** Identifier of the recorded answer, used to open its result. */
  attemptId: string;
  /** Name of the subtopic of the exercise. */
  subtopicName: string;
  /** Title of the exercise. */
  title: string;
  /** Outcome of the answer. */
  result: AttemptResult;
  /** Whether a wrong answer is still waiting to be reviewed. */
  isPendingReview: boolean;
  /** Human-readable answer time, for example `Hoy, 10:45 AM`. */
  answeredAt: string;
  /** Whether `answeredAt` is relative to today (shown with a clock) or a calendar date. */
  isRecent: boolean;
  /** Time the student took, for example `1m 42s`; `null` when unknown. */
  duration: string | null;
}

/**
 * Describes the totals of the practice history.
 */
export interface HistorySummary {
  /** Answers recorded. */
  total: number;
  /** Right answers. */
  correct: number;
  /** Wrong answers. */
  incorrect: number;
}

/**
 * Describes the practice history of the student.
 */
export interface PracticeHistory {
  /** Totals of every recorded answer. */
  summary: HistorySummary;
  /** Most recent recorded answers, newest first. */
  entries: HistoryEntry[];
  /** Spaced-practice advice shown under a filtered list. */
  advice: string;
}
