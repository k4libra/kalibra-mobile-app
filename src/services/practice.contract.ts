/**
 * Contract of the adaptive practice endpoints, implemented by the HTTP service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PracticeExercise, PracticeResult } from '@/types/exercise';

/**
 * Operations the student app needs to practice a subtopic.
 */
export interface PracticeContract {
  /** Fetches a verified subtopic exercise, or lets the server choose in EXPRESS mode. */
  getNextExercise: (courseId: string, subtopicId?: string, mode?: 'EXPRESS') => Promise<PracticeExercise>;
  /** Records the chosen option and returns the result, the explanation and the mastery change. */
  submitAnswer: (exerciseId: string, optionId: string, timeSpentSeconds?: number) => Promise<PracticeResult>;
  /** Fetches the result of a recorded answer; rejects when it does not exist. */
  getResult: (attemptId: string) => Promise<PracticeResult>;
}
