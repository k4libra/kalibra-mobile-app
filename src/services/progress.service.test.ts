/**
 * Tests for the progress service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { setMockSession } from '@/mocks/session.mock';
import { progressService } from './progress.service';

jest.useFakeTimers();

const demo = { user: { id: 'student-1', fullName: 'Valentina Morales Rivera', email: 'v.morales@upc.edu.pe' }, token: 'mock' };

async function settle<T>(promise: Promise<T>): Promise<T> {
  jest.runAllTimers();
  return promise;
}

afterEach(() => setMockSession(null));

describe('progressService', () => {
  it('orders subtopics by mastery and recommends the weakest one', async () => {
    setMockSession(demo as never);
    const progress = await settle(progressService.getCourseProgress('course-1'));
    expect(progress.subtopics.map(item => item.mastery)).toEqual([81, 72, 33, null]);
    expect(progress.focus).toMatchObject({ subtopicId: 'sub-3', mastery: 33 });
    expect(progress.practicedSubtopicCount).toBe(3);
  });

  it('returns history entries that point to practice results', async () => {
    setMockSession(demo as never);
    const history = await settle(progressService.getHistory());
    expect(history.summary).toEqual({ total: 42, correct: 31, incorrect: 11 });
    expect(history.entries.every(entry => /^ex-sub-\d+:opt-[a-d]$/.test(entry.attemptId))).toBe(true);
  });

  it('gives a new account an empty history and no course progress', async () => {
    setMockSession({ ...demo, user: { ...demo.user, id: 'student-9' } } as never);
    expect((await settle(progressService.getHistory())).entries).toEqual([]);
    await expect(settle(progressService.getCourseProgress('course-1'))).rejects.toThrow();
  });
});
