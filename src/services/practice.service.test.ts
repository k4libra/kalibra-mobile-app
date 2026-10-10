/**
 * Tests for the adaptive practice service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { practiceService } from './practice.service';

describe('practiceService', () => {
  it('labels the exercise with the requested subtopic', async () => {
    const exercise = await practiceService.getNextExercise('course-2', 'sub-5');
    expect(exercise.subtopicName).toBe('Espacios Vectoriales');
  });

  it('reports a correct answer with a mastery gain', async () => {
    const result = await practiceService.submitAnswer('ex-sub-1', 'opt-a');
    expect(result.isCorrect).toBe(true);
    expect(result.masteryDelta).toBeGreaterThan(0);
  });

  it('reports a wrong answer without mastery change', async () => {
    const result = await practiceService.submitAnswer('ex-sub-1', 'opt-c');
    expect(result.isCorrect).toBe(false);
    expect(result.masteryDelta).toBe(0);
  });

  it('reads back a recorded result', async () => {
    const { attemptId } = await practiceService.submitAnswer('ex-sub-1', 'opt-b');
    expect((await practiceService.getResult(attemptId)).isCorrect).toBe(false);
  });
});
