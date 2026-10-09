
/**
 * Mock service for academic progress
 * and practice history.
 *
 * Feature: progress-history
 *
 * Uses local mock data while keeping
 * the interface ready for backend integration.
 *
 * @packageDocumentation
 */

import {
    createCourseProgress,
    createPracticeHistory,
} from '../mocks/progress.mock';

import type {
    AcademicProgress,
    HistoryQuery,
    PracticeHistory,
    PracticeHistoryItem,
} from '../types/progress';

import type {
    ProgressHistoryServiceContract,
} from './progress.contract';

/**
 * Simulated network latency in milliseconds.
 */
const MOCK_DELAY_MS = 300;

/**
 * Simulates an asynchronous API request.
 */
function simulateRequest<T>(data: T): Promise<T> {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), MOCK_DELAY_MS);
    });
}

/**
 * Mock implementation of the progress
 * and practice history service.
 */
class ProgressHistoryService
    implements ProgressHistoryServiceContract
{
    /**
     * Returns academic progress for the
     * selected course.
     */
    async getAcademicProgress(
        courseId: string,
    ): Promise<AcademicProgress> {
        const progress = createCourseProgress(courseId);

        return simulateRequest(progress);
    }

    /**
     * Returns the initial progress state
     * used in the Figma preview.
     */
    async getEmptyAcademicProgress(
        courseId: string,
    ): Promise<AcademicProgress> {
        const progress = createCourseProgress(
            courseId,
            true,
        );

        return simulateRequest(progress);
    }

    /**
     * Returns practice history with optional
     * outcome, course and subtopic filters.
     */
    async getPracticeHistory(
        query: HistoryQuery = {},
    ): Promise<PracticeHistory> {
        const {
            filter = 'all',
            courseId,
            subtopicId,
        } = query;

        const history = createPracticeHistory(filter);

        let items: PracticeHistoryItem[] = history.items;

        if (courseId) {
            items = items.filter(
                item => item.courseId === courseId,
            );
        }

        if (subtopicId) {
            items = items.filter(
                item => item.subtopicId === subtopicId,
            );
        }

        return simulateRequest({
            ...history,
            items,
            // The summary contains aggregate Figma
            // mock totals, not just visible examples.
            // Therefore, filtering the examples does
            // not recalculate the global counters.
            isEmpty: history.summary.totalAttempts === 0,
        });
    }

    /**
     * Returns an empty practice history
     * for the initial Figma state.
     */
    async getEmptyPracticeHistory(): Promise<PracticeHistory> {
        return simulateRequest(
            createPracticeHistory('all', true),
        );
    }
}

/**
 * Shared service instance.
 *
 * Screens should consume this service
 * through feature hooks instead of
 * importing mocks directly.
 */
export const progressService:
    ProgressHistoryServiceContract =
    new ProgressHistoryService();
