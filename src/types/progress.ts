
/**
 * Academic progress and practice history models.
 *
 * Feature: progress-history
 *
 * Models for the progress dashboard, subtopic
 * mastery, practice attempts and history filters.
 *
 * @packageDocumentation
 */

import type {
    EnrolledCourse,
    StudentSubtopic,
} from './course';

/**
 * Supported history filters from Figma.
 */
export type HistoryFilter =
    | 'all'
    | 'correct'
    | 'review';

/**
 * Result of a completed exercise.
 */
export type ExerciseOutcome =
    | 'correct'
    | 'incorrect';

/**
 * Learning progress classification.
 */
export type ProgressLevel =
    | 'advanced'
    | 'intermediate'
    | 'basic'
    | 'not_started';

/**
 * Summary displayed in the academic
 * progress dashboard.
 */
export interface CourseProgress {
    course: EnrolledCourse;
    mastery: number | null;
    solvedExerciseCount: number;
    practicedSubtopicCount: number;
    totalSubtopicCount: number;
    level: ProgressLevel;
    levelLabel: string;
    isEmpty: boolean;
}

/**
 * Subtopic information displayed in
 * the mastery breakdown.
 */
export interface SubtopicProgress {
    subtopic: StudentSubtopic;
    mastery: number | null;
    correctExerciseCount: number;
    totalExerciseCount: number;
    isPracticed: boolean;
}

/**
 * Priority recommendation for a
 * subtopic requiring reinforcement.
 */
export interface WeakSubtopic {
    subtopicId: string;
    courseId: string;
    name: string;
    mastery: number;
    recommendedExerciseCount: number;
    description: string;
}

/**
 * Complete academic progress response.
 */
export interface AcademicProgress {
    courseProgress: CourseProgress;
    subtopics: SubtopicProgress[];
    weakSubtopic: WeakSubtopic | null;
}

/**
 * Single completed exercise attempt.
 */
export interface PracticeHistoryItem {
    id: string;
    exerciseId: string;
    courseId: string;
    subtopicId: string;
    subtopicName: string;
    exerciseTitle: string;
    outcome: ExerciseOutcome;
    completedAt: string;
    durationSeconds: number;
    reviewPending: boolean;
}

/**
 * Counters displayed in the history filters.
 */
export interface HistoryCounts {
    all: number;
    correct: number;
    review: number;
}

/**
 * Summary of student practice history.
 */
export interface PracticeHistorySummary {
    totalAttempts: number;
    correctAttempts: number;
    incorrectAttempts: number;
    accuracyPercentage: number | null;
    counts: HistoryCounts;
}

/**
 * Specialized practice recommendation
 * shown when filtering incorrect exercises.
 */
export interface PracticeRecommendation {
    title: string;
    description: string;
    targetAccuracy: number;
}

/**
 * Complete practice history response.
 */
export interface PracticeHistory {
    summary: PracticeHistorySummary;
    items: PracticeHistoryItem[];
    recommendation: PracticeRecommendation | null;
    isEmpty: boolean;
}

/**
 * Parameters for retrieving history.
 */
export interface HistoryQuery {
    filter?: HistoryFilter;
    courseId?: string;
    subtopicId?: string;
}

/**
 * Generic loading state for feature data.
 */
export interface ProgressLoadingState {
    isLoading: boolean;
    error: string | null;
}
