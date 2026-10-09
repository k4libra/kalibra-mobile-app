
/**
 * Service contracts for academic progress
 * and practice history.
 *
 * Feature: progress-history
 *
 * These interfaces define the operations
 * required by the progress and history screens.
 *
 * The initial implementation uses mock data.
 * A future backend implementation must follow
 * the same contracts.
 *
 * @packageDocumentation
 */

import type {
    AcademicProgress,
    HistoryQuery,
    PracticeHistory,
} from '../types/progress';

/**
 * Contract for retrieving academic progress.
 */
export interface ProgressServiceContract {
    /**
     * Retrieves academic progress for a course.
     *
     * @param courseId - Identifier of the course.
     * @returns Course mastery, subtopic progress
     * and reinforcement recommendations.
     */
    getAcademicProgress(
        courseId: string,
    ): Promise<AcademicProgress>;

    /**
     * Retrieves the initial progress state
     * for a course without practice activity.
     *
     * Used to preview the empty state from Figma.
     */
    getEmptyAcademicProgress(
        courseId: string,
    ): Promise<AcademicProgress>;
}

/**
 * Contract for retrieving practice history.
 */
export interface PracticeHistoryServiceContract {
    /**
     * Retrieves practice history.
     *
     * Supports:
     * - All exercises
     * - Correct exercises
     * - Exercises to review
     *
     * Optional course and subtopic filters
     * are reserved for backend integration.
     */
    getPracticeHistory(
        query?: HistoryQuery,
    ): Promise<PracticeHistory>;

    /**
     * Retrieves an empty practice history
     * for displaying the initial state.
     */
    getEmptyPracticeHistory(): Promise<PracticeHistory>;
}

/**
 * Combined contract for this feature.
 */
export interface ProgressHistoryServiceContract
    extends ProgressServiceContract,
        PracticeHistoryServiceContract {}
