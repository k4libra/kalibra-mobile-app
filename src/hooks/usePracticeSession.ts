/**
 * Owns the five-exercise session shared by practice and result routes.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NavigationContainerRefContext } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';

/** Exercises in one subtopic visit. */
export const PRACTICE_SESSION_SIZE = 5;

/** Local progress of the current subtopic visit. */
export interface PracticeSession {
  /** Account owning this visit. */
  accountId: string | undefined;
  /** Course being practiced. */
  courseId: string;
  /** Subtopic being practiced. */
  subtopicId: string;
  /** Route that loaded the most recent exercise. */
  routeKey: string;
  /** Current exercise number, from one through five. */
  position: number;
  /** Outcomes of successfully submitted answers. */
  outcomes: boolean[];
  /** Latest successfully recorded attempt, or null before submission. */
  attemptId: string | null;
}

/** Shared session state and its practice actions. */
export interface PracticeSessionState {
  /** Active visit, or null outside practice. */
  session: PracticeSession | null;
  /** Counts a loaded exercise once per route, starting a visit when the scope changes. */
  registerExercise: (courseId: string, subtopicId: string, routeKey: string) => void;
  /** Records an outcome only for the current exercise and only once. */
  recordAnswer: (routeKey: string, attemptId: string, isCorrect: boolean) => void;
}

/**
 * Tracks loaded exercises and submitted answers until navigation leaves their subtopic.
 *
 * @returns The account-scoped `session`, `registerExercise` and `recordAnswer` actions.
 *
 * @example
 * ```tsx
 * const state = usePracticeSessionState();
 * ```
 */
export function usePracticeSessionState(): PracticeSessionState {
  const navigation = useContext(NavigationContainerRefContext);
  const accountId = useContext(AuthContext)?.session?.user.id;
  const [stored, setStored] = useState<PracticeSession | null>(null);
  const session = stored?.accountId === accountId ? stored : null;

  useEffect(() => { setStored(null); }, [accountId]);
  useEffect(() => navigation?.addListener('state', () => {
    const state = navigation.getRootState();
    const route = state?.routes[state.index];
    setStored(previous => {
      if (!previous) return null;
      const params = route?.params as { courseId?: string; subtopicId?: string; attemptId?: string } | undefined;
      const isExercise = route?.name === 'Exercise'
        && params?.courseId === previous.courseId && params?.subtopicId === previous.subtopicId;
      const isResult = route?.name === 'ExerciseResult' && params?.attemptId === previous.attemptId;
      return isExercise || isResult ? previous : null;
    });
  }), [navigation]);

  const registerExercise = useCallback((courseId: string, subtopicId: string, routeKey: string) => {
    const state = navigation?.getRootState();
    const active = state?.routes[state.index];
    // A generator response may arrive after the student has left the practice route.
    if (navigation && active?.key !== routeKey) return;
    setStored(previous => {
      if (previous && previous.accountId === accountId && previous.courseId === courseId && previous.subtopicId === subtopicId) {
        if (previous.routeKey === routeKey || previous.position === PRACTICE_SESSION_SIZE) return previous;
        return { ...previous, routeKey, position: previous.position + 1, attemptId: null };
      }
      return { accountId, courseId, subtopicId, routeKey, position: 1, outcomes: [], attemptId: null };
    });
  }, [accountId, navigation]);

  const recordAnswer = useCallback((routeKey: string, attemptId: string, isCorrect: boolean) => {
    setStored(previous => previous && previous.accountId === accountId && previous.routeKey === routeKey && previous.attemptId === null
      ? { ...previous, attemptId, outcomes: [...previous.outcomes, isCorrect] }
      : previous);
  }, [accountId]);

  return useMemo(() => ({ session, registerExercise, recordAnswer }), [session, registerExercise, recordAnswer]);
}
