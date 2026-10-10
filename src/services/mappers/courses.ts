/**
 * Maps curriculum and measured progress without inventing academic metadata.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseDto, MasteryDto, ProgressDto } from '@/types/api';
import type { EnrolledCourse, StudentSubtopic } from '@/types/course';
import type { CourseProgress } from '@/types/progress';
/**
 * Averages known percentages; no practice remains unknown rather than zero.
 *
 * @param values - Percentages from 0 to 100, with null for unpracticed subjects.
 * @returns The rounded average of known values, or null with no activity.
 *
 * @example
 * ```ts
 * averageMastery([40, 70, null]); // 55
 * ```
 */
export function averageMastery(values: (number | null)[]): number | null {
  const known = values.filter((value): value is number => value !== null);
  return known.length
    ? Math.round(known.reduce((sum, value) => sum + value, 0) / known.length)
    : null;
}
/**
 * Combines enrollment metadata with the exact progress percentages.
 *
 * @param dto - Enrolled curriculum and teacher metadata.
 * @param progress - Exact subtopic percentages and solved counts.
 * @returns The course card model with unavailable metadata left empty.
 *
 * @example
 * ```ts
 * mapCourse(courseDto, progressDto).mastery;
 * ```
 */
export function mapCourse(
  dto: CourseDto,
  progress: ProgressDto,
): EnrolledCourse {
  return {
    id: dto.courseId,
    name: dto.name,
    code: dto.code,
    teacherName: dto.teacherName,
    faculty: '',
    semester: '',
    icon: 'menu_book',
    focus: dto.subtopics.map(item => item.name).join(' · '),
    mastery: progress.hasActivity
      ? averageMastery(progress.subtopics.map(item => item.mastery))
      : null,
    masteredSubtopicCount: progress.hasActivity
      ? progress.subtopics.filter(
          item => item.mastery !== null && item.mastery >= 70,
        ).length
      : 0,
    subtopicCount: dto.subtopics.length,
    solvedExerciseCount: progress.hasActivity
      ? progress.subtopics.reduce((sum, item) => sum + item.solvedCount, 0)
      : 0,
    estimatedTimeLeft: '',
  };
}
/**
 * Maps ordered subtopics; qualitative levels never substitute for exact percentages.
 *
 * @param dto - Curriculum with its display ordering.
 * @param progress - Exact measured percentages.
 * @param masteries - Qualitative mastery labels; never converted to percentages.
 * @returns Ordered UI subtopics without mutating their DTOs.
 *
 * @example
 * ```ts
 * mapSubtopics(courseDto, progressDto).map(item => item.id);
 * ```
 */
export function mapSubtopics(
  dto: CourseDto,
  progress: ProgressDto,
  masteries: MasteryDto[] = [],
): StudentSubtopic[] {
  return [...dto.subtopics]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(item => {
      const measured = progress.subtopics.find(
        value => value.subtopicId === item.id,
      );
      const level =
        masteries.find(value => value.subtopicId === item.id)?.level ??
        measured?.level ??
        'NO_DATA';
      return {
        id: item.id,
        courseId: dto.courseId,
        order: item.displayOrder,
        name: item.name,
        description: '',
        icon: 'account_tree',
        mastery: progress.hasActivity ? measured?.mastery ?? null : null,
        note:
          level === 'NO_DATA' || !progress.hasActivity ? 'Sin práctica' : '',
      };
    });
}
/**
 * Maps progress, orders known percentages first and recommends the weakest low-mastery subtopic.
 *
 * @param dto - Enrolled curriculum.
 * @param progress - Activity flag and measured mastery.
 * @returns Measured progress with a recommendation for the weakest low-mastery subtopic.
 *
 * @example
 * ```ts
 * mapProgress(courseDto, progressDto).hasActivity;
 * ```
 */
export function mapProgress(
  dto: CourseDto,
  progress: ProgressDto,
): CourseProgress {
  const subtopics = mapSubtopics(dto, progress)
    .map(item => ({
      ...item,
      correctCount: null,
      attemptCount: progress.hasActivity
        ? progress.subtopics.find(value => value.subtopicId === item.id)
            ?.solvedCount ?? 0
        : 0,
    }))
    .sort((a, b) => (b.mastery ?? -1) - (a.mastery ?? -1));
  const weakest = [...subtopics]
    .reverse()
    .find(item => item.mastery !== null && item.mastery < 40);
  return {
    course: mapCourse(dto, progress),
    subtopics,
    hasActivity: progress.hasActivity,
    practicedSubtopicCount: subtopics.filter(item => item.attemptCount > 0)
      .length,
    focus: weakest
      ? {
          subtopicId: weakest.id,
          subtopicName: weakest.name,
          mastery: weakest.mastery!,
          message: `Refuerza ${weakest.name} con una nueva práctica.`,
        }
      : null,
  };
}
