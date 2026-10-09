
/**
 * Hook for student practice history.
 *
 * Feature: progress-history
 *
 * Handles history filters, loading,
 * errors and the empty-state preview.
 *
 * @packageDocumentation
 */

import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import { progressService } from '../services/progress.service';

import type {
    HistoryFilter,
    HistoryQuery,
    PracticeHistory,
} from '../types/progress';

interface UsePracticeHistoryOptions {
    initialFilter?: HistoryFilter;
    courseId?: string;
    subtopicId?: string;
}

interface UsePracticeHistoryResult {
    history: PracticeHistory | null;
    filter: HistoryFilter;
    isLoading: boolean;
    error: string | null;
    isEmptyPreview: boolean;
    setFilter: (filter: HistoryFilter) => void;
    setEmptyPreview: (enabled: boolean) => void;
    refreshHistory: () => Promise<void>;
    clearError: () => void;
}

/**
 * Retrieves practice history and manages
 * the filters shown in the Figma design.
 */
export function usePracticeHistory(
    options: UsePracticeHistoryOptions = {},
): UsePracticeHistoryResult {
    const {
        initialFilter = 'all',
        courseId,
        subtopicId,
    } = options;

    const [history, setHistory] =
        useState<PracticeHistory | null>(null);

    const [filter, setFilterState] =
        useState<HistoryFilter>(initialFilter);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [isEmptyPreview, setIsEmptyPreviewState] =
        useState(false);

    const [reloadKey, setReloadKey] =
        useState(0);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const setFilter = useCallback(
        (nextFilter: HistoryFilter) => {
            setFilterState(nextFilter);
            setHistory(null);
            setError(null);
        },
        [],
    );

    const setEmptyPreview = useCallback(
        (enabled: boolean) => {
            setIsEmptyPreviewState(enabled);
            setHistory(null);
            setError(null);
        },
        [],
    );

    const refreshHistory = useCallback(async () => {
        setReloadKey(previous => previous + 1);
    }, []);

    useEffect(() => {
        let active = true;

        const loadHistory = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const query: HistoryQuery = {
                    filter,
                    courseId,
                    subtopicId,
                };

                const result = isEmptyPreview
                    ? await progressService.getEmptyPracticeHistory()
                    : await progressService.getPracticeHistory(query);

                if (active) {
                    setHistory(result);
                }
            } catch (caughtError) {
                if (active) {
                    setHistory(null);
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'No se pudo cargar el historial de práctica.',
                    );
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void loadHistory();

        return () => {
            active = false;
        };
    }, [
        filter,
        courseId,
        subtopicId,
        isEmptyPreview,
        reloadKey,
    ]);

    return {
        history,
        filter,
        isLoading,
        error,
        isEmptyPreview,
        setFilter,
        setEmptyPreview,
        refreshHistory,
        clearError,
    };
}
