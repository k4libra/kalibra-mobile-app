/**
 * Tests for the student courses service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { TEST_CREDENTIALS, TEST_COURSES } from '@/test/apiFixtures';
import { jsonResponse, resetApiStub } from '@/test/fetchStub';
import { coursesService } from './courses.service';


beforeEach(async () => {
  resetApiStub();
  await authService.signIn(TEST_CREDENTIALS);
});

describe('coursesService', () => {
  it('lists the enrolled courses', async () => {
    expect((await coursesService.listCourses()).length).toBeGreaterThan(0);
  });

  it('lists only the subtopics of the requested course', async () => {
    const subtopics = await coursesService.listSubtopics('course-1');
    expect(subtopics.every(subtopic => subtopic.courseId === 'course-1')).toBe(true);
  });

  it('rejects an unknown course', async () => {
    await expect(coursesService.getCourse('missing')).rejects.toThrow();
  });
});

test('uses the enrolled term for student and profile even when it differs from the device date', async () => {
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/students/me/courses')
    ? Promise.resolve(jsonResponse(TEST_COURSES.map(course => ({ ...course, term: '2025-I' }))))
    : original(url, init));
  expect((await coursesService.getStudent()).term).toBe('2025-I');
  expect((await authService.getProfile()).user.term).toBe('2025-I');
});
