/**
 * Tests the HTTP integration behavior of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { practiceService } from '@/services/practice.service';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { resetApiStub, jsonResponse } from '@/test/fetchStub';
import { API_BASE_URL } from '@/config/api';
let fetchSpy: ReturnType<typeof resetApiStub>;
beforeEach(async () => { fetchSpy = resetApiStub(); await authService.signIn(TEST_CREDENTIALS); });
afterEach(() => jest.restoreAllMocks());
test('requests the verified exercise and maps ordered A-D keys', async () => {
  const exercise = await practiceService.getNextExercise('course-2', 'sub-5');
  expect(exercise.subtopicName).toBe('Espacios Vectoriales');
  expect(exercise.options.map(item => item.id)).toEqual(['A', 'B', 'C', 'D']);
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/practice-exercises`, expect.objectContaining({ method: 'POST', body: JSON.stringify({ courseId: 'course-2', subtopicId: 'sub-5' }) }));
});
test('submits the course and option key once and reads the cached result without resubmission', async () => {
  const exercise = await practiceService.getNextExercise('course-1', 'sub-1');
  const result = await practiceService.submitAnswer(exercise.id, 'A');
  expect(result.isCorrect).toBe(true);
  const count = fetchSpy.mock.calls.length;
  expect(await practiceService.getResult(result.attemptId)).toEqual(result);
  expect(fetchSpy).toHaveBeenCalledTimes(count);
  expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/exercise-attempts`, expect.objectContaining({ body: JSON.stringify({ courseId: 'course-1', exerciseId: exercise.id, selectedOptionKey: 'A' }) }));
});
test('restores a historical result with its server explanation and signed mastery delta', async () => {
  const result = await practiceService.getResult('attempt-2');
  expect(result).toMatchObject({ isCorrect: false, masteryDelta: -2, exerciseId: null });
  expect(result.explanation).toContain('prefijos');
});
test.each([404, 503])('exposes the practice state for HTTP %s', async status => {
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/practice-exercises') ? Promise.resolve(jsonResponse({ status }, status)) : original(url, init));
  await expect(practiceService.getNextExercise('course-1', 'sub-1')).rejects.toMatchObject({ status, code: status === 404 ? 'NO_EXERCISES' : 'SERVICE_UNAVAILABLE' });
});
test('clears cached results on sign-out and cannot expose them to a new account', async () => {
  await practiceService.getResult('attempt-2');
  await authService.signOut();
  await authService.signUp({ fullName: 'Student Two', email: 'estudiante.test4@upc.edu.pe', password: 'Example2025!' });
  await expect(practiceService.getResult('attempt-2')).rejects.toMatchObject({ status: 404 });
});
