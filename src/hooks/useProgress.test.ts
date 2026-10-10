/**
 * Tests for the progress helpers and the mastery ring math.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { progressBand } from '@/components/progress';
import type { EnrolledCourse } from '@/types/course';
import { percent } from '@/utils/percent';
import { defaultProgressCourseId } from './useProgress';

describe('defaultProgressCourseId', () => {
  it('picks the course with the most solved exercises', () => {
    const courses = [
      { id: 'a', solvedExerciseCount: 3 },
      { id: 'b', solvedExerciseCount: 9 },
    ] as EnrolledCourse[];
    expect(defaultProgressCourseId(courses)).toBe('b');
  });

  it('returns null without courses', () => {
    expect(defaultProgressCourseId([])).toBeNull();
  });
});

describe('progressBand and percent', () => {
  it('maps mastery to bands with the shared thresholds', () => {
    expect(progressBand(81)).toBe('optimal');
    expect(progressBand(62)).toBe('steady');
    expect(progressBand(33)).toBe('reinforce');
  });

  it('rounds percentages and handles empty totals', () => {
    expect(percent(31, 42)).toBe(74);
    expect(percent(0, 0)).toBeNull();
  });
});
