/**
 * Domain types of the course invitations a student receives.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName } from './ui';

/**
 * State of an invitation from the student's point of view: `pending` can be answered, `expired` cannot.
 */
export type StudentInvitationStatus = 'pending' | 'expired';

/**
 * Describes an invitation to join a course.
 */
export interface StudentInvitation {
  /** Unique identifier assigned by the server. */
  id: string;
  /** Course the student is invited to. */
  courseId: string;
  /** Name of the course. */
  courseName: string;
  /** Institutional code of the course. */
  courseCode: string;
  /** Academic term of the course, for example `2025-I`. */
  term: string;
  /** Teacher who sent the invitation. */
  teacherName: string;
  /** Icon of the course. */
  icon: IconName;
  /** Human-readable send date, for example `03 sep`. */
  sentAt: string;
  /** Human-readable validity, for example `Vence en 2 días`. */
  validity: string;
  /** State of the invitation. */
  status: StudentInvitationStatus;
}
