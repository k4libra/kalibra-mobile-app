/**
 * Tests the HTTP integration behavior of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { progressService } from '@/services/progress.service';
import { TEST_CREDENTIALS, TEST_ATTEMPTS } from '@/test/apiFixtures';
import { resetApiStub, jsonResponse } from '@/test/fetchStub';
import { API_BASE_URL } from '@/config/api';
let fetchSpy: ReturnType<typeof resetApiStub>;
beforeEach(async () => { fetchSpy = resetApiStub(); await authService.signIn(TEST_CREDENTIALS); });
afterEach(() => jest.restoreAllMocks());
test('orders percentages and recommends the weakest low-mastery subtopic', async () => {
  const progress = await progressService.getCourseProgress('course-1');
  expect(progress.subtopics.map(item => item.mastery)).toEqual([81, 72, 33, null]);
  expect(progress.focus).toMatchObject({ subtopicId: 'sub-3', mastery: 33 });
  expect(progress.practicedSubtopicCount).toBe(3);
});
test('preserves the server no-activity state', async () => {
  const progress = await progressService.getCourseProgress('course-3');
  expect(progress.hasActivity).toBe(false);
  expect(progress.course.mastery).toBeNull();
});
test('aggregates server totals and requests outcome filters per enrolled course', async () => {
  const history = await progressService.getHistory('review');
  expect(history.summary).toEqual({ total: 3, correct: 2, incorrect: 1 });
  expect(history.entries.map(item => item.attemptId)).toEqual(['attempt-2']);
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/exercise-attempts?courseId=course-1&result=INCORRECT&page=0&size=100`, expect.objectContaining({ method: 'GET' }));
});
test('reads subsequent pages without multiplying whole-course totals', async () => {
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockImplementation(async (url, init) => {
    if (String(url).includes('/exercise-attempts?courseId=course-1')) {
      const page = String(url).includes('page=1') ? 1 : 0;
      return jsonResponse({ allCount: 2, correctCount: 1, incorrectCount: 1, activeFilter: 'ALL', content: [TEST_ATTEMPTS[page]], page, size: 100, totalElements: 2, totalPages: 2 });
    }
    return original(url, init);
  });
  const history = await progressService.getHistory();
  expect(history.entries).toHaveLength(2);
  expect(history.summary.total).toBe(2);
  expect(fetchSpy.mock.calls.some(([url]) => String(url).includes('page=1'))).toBe(true);
});
