/**
 * Domain types of the courses a student is enrolled in.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ImageSourcePropType } from 'react-native';
import type { IconName } from './ui';

/**
 * Describes a course the student is enrolled in, with the progress shown in its card.
 */
export interface EnrolledCourse {
  /** Unique identifier assigned by the server. */
  id: string;
  /** Name of the course. */
  name: string;
  /** Institutional code, for example `CS-204`. */
  code: string;
  /** Full name of the teacher. */
  teacherName: string;
  /** Faculty that offers the course. */
  faculty: string;
  /** Semester label, for example `Semestre IV`. */
  semester: string;
  /** Icon chosen by the teacher to identify the course. */
  icon: IconName;
  /** Short list of the subtopics being worked on, shown under the name. */
  focus: string;
  /** Overall mastery of the student from 0 to 100; `null` before the first exercise. */
  mastery: number | null;
  /** Number of subtopics with high mastery. */
  masteredSubtopicCount: number;
  /** Number of subtopics of the course. */
  subtopicCount: number;
  /** Exercises the student has solved in the course. */
  solvedExerciseCount: number;
  /** Estimated study time left, for example `14h`. */
  estimatedTimeLeft: string;
}

/**
 * Describes a subtopic of an enrolled course with the mastery of the student.
 */
export interface StudentSubtopic {
  /** Unique identifier assigned by the server. */
  id: string;
  /** Course the subtopic belongs to. */
  courseId: string;
  /** Position in the course, starting at 1. */
  order: number;
  /** Name of the subtopic. */
  name: string;
  /** What the subtopic covers. */
  description: string;
  /** Icon of the subtopic. */
  icon: IconName;
  /** Mastery of the student from 0 to 100; `null` while not started. */
  mastery: number | null;
  /** Short status note, for example `6 ejercicios pendientes`. */
  note: string;
}

/**
 * Describes the signed-in student.
 */
export interface Student {
  /** First name used in greetings. */
  firstName: string;
  /** Current academic term, for example `2025-I`. */
  term: string;
  /** Profile photo. */
  avatar: ImageSourcePropType;
  /** Exercises solved across every course. */
  solvedExerciseCount: number;
  /** Average mastery across every course, from 0 to 100. */
  averageMastery: number;
  /** Invitations waiting for an answer. */
  pendingInvitationCount: number;
}
