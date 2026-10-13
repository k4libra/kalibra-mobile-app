/**
 * Describes student API resources from the REST source and contract v2.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/** User identity returned by authentication and users/me. */
export interface UserDto {
  /** Server identifier. */
  id: string;
  /** Institutional email. */
  email: string;
  /** Given names introduced by contract v2. */
  firstName: string;
  /** Family names introduced by contract v2. */
  lastName: string;
  /** Server role names. */
  roles: string[];
}
/** Student preferences returned by the API. */
export interface PreferencesDto {
  /** Whether reminders are enabled. */
  dailyReminderEnabled: boolean;
  /** Reminder time in UTC, or null when unset. */
  dailyReminderTime: string | null;
  /** Stored dark-mode preference. */
  darkMode: boolean;
}
/** Ordered subtopic within an enrolled course. */
export interface SubtopicDto {
  /** Server identifier. */
  id: string;
  /** Display name. */
  name: string;
  /** Course ordering. */
  displayOrder: number;
}
/** Enrolled course from contract v2. */
export interface CourseDto {
  /** Course identifier. */
  courseId: string;
  /** Display name. */
  name: string;
  /** Institutional code. */
  code: string;
  /** Teacher display name, or null when unavailable. */
  teacherName: string | null;
  /** Ordered curriculum. */
  subtopics: SubtopicDto[];
  /** Enrollment date in ISO format. */
  enrolledAt: string;
}
/** Qualitative mastery without a percentage. */
export interface MasteryDto {
  /** Subtopic identifier. */
  subtopicId: string;
  /** Subtopic name. */
  name: string;
  /** Server classification. */
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'NO_DATA';
}
/** Progress of a subtopic with exact percentage and solved total. */
export interface SubtopicProgressDto {
  /** Subtopic identifier. */
  subtopicId: string;
  /** Display name. */
  subtopicName: string;
  /** Percentage 0..100, or null before practice. */
  mastery: number | null;
  /** Server classification. */
  level: MasteryDto['level'];
  /** Number of submitted answers. */
  solvedCount: number;
}
/** Progress of the current student in one course. */
export interface ProgressDto {
  /** Student identifier. */
  studentId: string;
  /** Course identifier. */
  courseId: string;
  /** Whether the course has submitted answers. */
  hasActivity: boolean;
  /** Exact mastery and counts per subtopic. */
  subtopics: SubtopicProgressDto[];
  /** Latest explanations. */
  recentFeedback: string[];
}
/** Pending invitation; the API omits its course identifier until acceptance. */
export interface PendingInvitationDto {
  /** Invitation identifier. */
  id: string;
  /** Course display name. */
  courseName: string;
  /** Sender email (the API does not return a teacher name here). */
  teacherEmail: string;
  /** Send date in ISO format. */
  sentAt: string;
  /** Expiry date in ISO format. */
  expiresAt: string;
}
/** Invitation returned after acceptance or rejection. */
export interface InvitationDto {
  /** Invitation identifier. */
  id: string;
  /** Course identifier made available by acceptance. */
  courseId: string;
  /** Invited student's email. */
  invitedEmail: string;
  /** Current server status. */
  status: string;
  /** Send date in ISO format. */
  sentAt: string;
  /** Expiry date in ISO format. */
  expiresAt: string;
}
/** Verified practice exercise with options ordered A through D. */
export interface ExerciseDto {
  /** Exercise identifier. */
  exerciseId: string;
  /** Subtopic identifier. */
  subtopicId: string;
  /** Full exercise statement. */
  statement: string;
  /** Adaptive difficulty; older servers may omit it. */
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  /** Answer values in key order. */
  options: string[];
}
/** Recorded answer returned both on submission and in history. */
export interface AttemptDto {
  /** Attempt identifier. */
  id: string;
  /** Subtopic identifier. */
  subtopicId: string;
  /** Original exercise statement. */
  statement: string;
  /** Correctness classification. */
  result: 'CORRECT' | 'INCORRECT';
  /** Explanation returned by the adaptive engine. */
  explanation: string;
  /** Previous percentage, null when unknown. */
  previousMastery: number | null;
  /** Resulting percentage 0..100. */
  currentMastery: number;
  /** Signed change in percentage points. */
  masteryDeltaPoints: number;
  /** Whether mastery changed. */
  masteryChanged: boolean;
  /** Submission date in ISO format. */
  answeredAt: string;
}
/** History page with counts independent of the active filter. */
export interface HistoryDto {
  /** Total answers for the course. */
  allCount: number;
  /** Correct answers for the course. */
  correctCount: number;
  /** Incorrect answers for the course. */
  incorrectCount: number;
  /** Applied outcome filter. */
  activeFilter: 'ALL' | 'CORRECT' | 'INCORRECT';
  /** Entries in this page. */
  content: AttemptDto[];
  /** Zero-based page index. */
  page: number;
  /** Maximum page size. */
  size: number;
  /** Entries matching the filter. */
  totalElements: number;
  /** Pages matching the filter. */
  totalPages: number;
}
