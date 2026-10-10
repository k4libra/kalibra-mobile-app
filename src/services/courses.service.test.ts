/**
 * Tests for the student courses service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { resetApiStub } from '@/test/fetchStub';
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
