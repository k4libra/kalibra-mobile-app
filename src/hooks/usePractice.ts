/**
 * Hooks of the exercise and result screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { NavigationRouteContext } from '@react-navigation/native';
import { usePracticeSession } from '@/context/PracticeContext';
import { practiceService } from '@/services/practice.service';
import type { PracticeResult } from '@/types/exercise';
import { useResource } from './useResource';
import { PRACTICE_SESSION_SIZE } from './usePracticeSession';

/**
 * Loads the next exercise of a subtopic and exposes the answer submission.
 *
 * @param courseId - Course being practiced.
 * @param subtopicId - Subtopic being practiced.
 * @returns The `exercise` (`null` while loading), `submit` (resolves with the result or `null` on
 * failure), and the `isLoading`, `isSubmitting`, `isEmpty` and `error` state.
 *
 * @example
 * ```tsx
 * const { exercise, submit } = useExercise(courseId, subtopicId);
 * ```
 */
export function useExercise(courseId: string, subtopicId: string) {
  const { session, registerExercise, recordAnswer } = usePracticeSession();
  const route = useContext(NavigationRouteContext);
  const hookId = useId();
  const routeKey = route?.key ?? hookId;
  const { data, isLoading, error, errorCode } = useResource(
    () => practiceService.getNextExercise(courseId, subtopicId),
    `exercise-${courseId}-${subtopicId}`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pending = useRef(false);
  useEffect(() => {
    if (data) registerExercise(courseId, subtopicId, routeKey);
  }, [data, courseId, subtopicId, routeKey, registerExercise]);

  const submit = useCallback(async (exerciseId: string, optionId: string): Promise<PracticeResult | null> => {
    if (pending.current) return null;
    pending.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await practiceService.submitAnswer(exerciseId, optionId);
      recordAnswer(routeKey, result.attemptId, result.isCorrect);
      return result;
    } catch (reason: unknown) {
      setSubmitError(reason instanceof Error ? reason.message : 'No se pudo enviar la respuesta.');
      return null;
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }, [recordAnswer, routeKey]);

  const exercise = data ? {
    ...data,
    position: session?.routeKey === routeKey ? session.position : 1,
    sessionSize: PRACTICE_SESSION_SIZE,
  } : null;
  return { exercise, submit, isLoading, isSubmitting, error: error ?? submitError, isEmpty: errorCode === 'NO_EXERCISES' };
}

/**
 * Loads the result of a recorded answer.
 *
 * @param attemptId - Recorded answer.
 * @returns The `result` (`null` while loading), `isSessionComplete`, and the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { result } = usePracticeResult(attemptId);
 * ```
 */
export function usePracticeResult(attemptId: string) {
  const { session } = usePracticeSession();
  const { data, isLoading, error } = useResource(() => practiceService.getResult(attemptId), `result-${attemptId}`);
  const result = data && session?.attemptId === attemptId ? {
    ...data,
    position: session.position,
    sessionSize: PRACTICE_SESSION_SIZE,
    sessionOutcomes: session.outcomes,
  } : data;
  return { result, isSessionComplete: result?.position === PRACTICE_SESSION_SIZE, isLoading, error };
}
