/**
 * Hooks of the exercise and result screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { practiceService } from '@/services/practice.service';
import type { PracticeResult } from '@/types/exercise';
import { useResource } from './useResource';

/**
 * Loads the next exercise of a subtopic and exposes the answer submission.
 *
 * @param courseId - Course being practiced.
 * @param subtopicId - Subtopic being practiced.
 * @returns The `exercise` (`null` while loading), `submit` (resolves with the result or `null` on
 * failure), and the `isLoading`, `isSubmitting` and `error` state.
 *
 * @example
 * ```tsx
 * const { exercise, submit } = useExercise(courseId, subtopicId);
 * ```
 */
export function useExercise(courseId: string, subtopicId: string) {
  const { data, isLoading, error } = useResource(
    () => practiceService.getNextExercise(courseId, subtopicId),
    `exercise-${courseId}-${subtopicId}`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(async (exerciseId: string, optionId: string): Promise<PracticeResult | null> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      return await practiceService.submitAnswer(exerciseId, optionId);
    } catch (reason: unknown) {
      setSubmitError(reason instanceof Error ? reason.message : 'No se pudo enviar la respuesta.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { exercise: data, submit, isLoading, isSubmitting, error: error ?? submitError };
}

/**
 * Loads the result of a recorded answer.
 *
 * @param attemptId - Recorded answer.
 * @returns The `result` (`null` while loading), the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { result } = usePracticeResult(attemptId);
 * ```
 */
export function usePracticeResult(attemptId: string) {
  const { data, isLoading, error } = useResource(() => practiceService.getResult(attemptId), `result-${attemptId}`);
  return { result: data, isLoading, error };
}
