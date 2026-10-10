/**
 * Contract of the adaptive practice endpoints, shared by the real and the simulated service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PracticeExercise, PracticeResult } from '@/types/exercise';

/**
 * Operations the student app needs to practice a subtopic.
 */
export interface PracticeContract {
  /** Fetches the next verified exercise for the current level of the student in a subtopic. */
  getNextExercise: (courseId: string, subtopicId: string) => Promise<PracticeExercise>;
  /** Records the chosen option and returns the result, the explanation and the mastery change. */
  submitAnswer: (exerciseId: string, optionId: string) => Promise<PracticeResult>;
  /** Fetches the result of a recorded answer; rejects when it does not exist. */
  getResult: (attemptId: string) => Promise<PracticeResult>;
}
