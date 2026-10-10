/**
 * Maps answer history using server dates and outcome classifications.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AttemptDto, CourseDto } from '@/types/api';
import type { HistoryEntry } from '@/types/progress';
/**
 * Maps an answer to its result route without inventing duration or review status.
 *
 * @param dto - Recorded answer including statement, outcome and ISO submission time.
 * @param course - Curriculum used to resolve the subtopic name.
 * @returns A history entry linking to the existing attempt identifier.
 *
 * @example
 * ```ts
 * mapHistoryEntry(attemptDto, courseDto).attemptId;
 * ```
 */
export function mapHistoryEntry(
  dto: AttemptDto,
  course: CourseDto,
): HistoryEntry {
  return {
    attemptId: dto.id,
    subtopicName:
      course.subtopics.find(item => item.id === dto.subtopicId)?.name ?? '',
    title: dto.statement,
    result: dto.result === 'CORRECT' ? 'correct' : 'incorrect',
    isPendingReview: false,
    answeredAt: new Date(dto.answeredAt).toLocaleString('es-PE'),
    isRecent: false,
    duration: null,
  };
}
