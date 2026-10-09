
/**
 * Hook for academic progress.
 *
 * Feature: progress-history
 *
 * Handles course selection, loading,
 * error states and the empty-state preview.
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
    AcademicProgress,
} from '../types/progress';

interface UseProgressResult {
    progress: AcademicProgress | null;
    selectedCourseId: string;
    isLoading: boolean;
    error: string | null;
    isEmptyPreview: boolean;
    selectCourse: (courseId: string) => void;
    setEmptyPreview: (enabled: boolean) => void;
    refreshProgress: () => Promise<void>;
    clearError: () => void;
}

/**
 * Loads academic progress for the selected course.
 *
 * @param initialCourseId - Course selected initially.
 */
export function useProgress(
    initialCourseId: string,
): UseProgressResult {
    const [selectedCourseId, setSelectedCourseId] =
        useState(initialCourseId);

    const [progress, setProgress] =
        useState<AcademicProgress | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [isEmptyPreview, setIsEmptyPreview] =
        useState(false);

    const [reloadKey, setReloadKey] =
        useState(0);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const selectCourse = useCallback(
        (courseId: string) => {
            setSelectedCourseId(courseId);
            setProgress(null);
            setError(null);
        },
        [],
    );

    const setEmptyPreview = useCallback(
        (enabled: boolean) => {
            setIsEmptyPreview(enabled);
            setProgress(null);
            setError(null);
        },
        [],
    );

    const refreshProgress = useCallback(async () => {
        setReloadKey(previous => previous + 1);
    }, []);

    useEffect(() => {
        let active = true;

        const loadProgress = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = isEmptyPreview
                    ? await progressService.getEmptyAcademicProgress(
                        selectedCourseId,
                    )
                    : await progressService.getAcademicProgress(
                        selectedCourseId,
                    );

                if (active) {
                    setProgress(result);
                }
            } catch (caughtError) {
                if (active) {
                    setProgress(null);
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'No se pudo cargar el progreso académico.',
                    );
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void loadProgress();

        return () => {
            active = false;
        };
    }, [
        selectedCourseId,
        isEmptyPreview,
        reloadKey,
    ]);

    return {
        progress,
        selectedCourseId,
        isLoading,
        error,
        isEmptyPreview,
        selectCourse,
        setEmptyPreview,
        refreshProgress,
        clearError,
    };
}
