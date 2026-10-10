/**
 * Domain contracts for authentication and student profiles.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { ImageSourcePropType } from 'react-native';

/** Account role supported by the student app. */
export type AuthRole = 'student';
/** Account identity without stored credentials. */
export interface AuthUser {
  /** Stable account identifier. */
  id: string;
  /** Name shown on the profile. */
  fullName: string;
  /** Institutional email, normalized to lowercase. */
  email: string;
  /** Access role of the account. */
  role: AuthRole;
  /** Faculty label; empty before enrollment. */
  faculty: string;
  /** Semester label; empty before enrollment. */
  semester: string;
}
/** Credentials submitted to sign in. */
export interface SignInCredentials {
  /** Institutional email. */
  email: string;
  /** Password provided by the user. */
  password: string;
  /** Future persistence preference; the mock remains in memory. */
  rememberDevice: boolean;
}
/** Data submitted to register a student. */
export interface SignUpData {
  /** Full display name. */
  fullName: string;
  /** Institutional email. */
  email: string;
  /** Password with at least eight characters, letters and numbers. */
  password: string;
}
/** Authenticated account and its mock session identifier. */
export interface AuthSession {
  /** Signed-in account. */
  user: AuthUser;
  /** Local placeholder token; never a real credential. */
  accessToken: string;
}
/** Aggregate academic statistics of the current account. */
export interface ProfileStats {
  /** Total completed exercises. */
  solvedExerciseCount: number;
  /** Average mastery percentage; null when no activity exists. */
  averageMastery: number | null;
  /** Number of active courses. */
  activeCourseCount: number;
}
/** Account-scoped learning preferences. */
export interface ProfilePreferences {
  /** Whether late study mode is enabled; does not change the reference palette. */
  darkMode: boolean;
  /** Whether daily reminders are enabled. */
  dailyReminders: boolean;
}
/** Complete student profile returned by the service. */
export interface StudentProfile {
  /** Account identity. */
  user: AuthUser;
  /** Academic totals. */
  stats: ProfileStats;
  /** Preferences of this account. */
  preferences: ProfilePreferences;
}
/** Domain failure codes used by authentication actions. */
export type AuthErrorCode = 'INVALID_EMAIL' | 'EMAIL_ALREADY_REGISTERED' | 'INVALID_CREDENTIALS' | 'INVALID_PASSWORD' | 'REQUIRED_FIELD' | 'UNAUTHORIZED' | 'UNKNOWN_ERROR';
/** Normalized authentication failure exposed to the UI. */
export interface AuthError {
  /** Machine-readable reason. */
  code: AuthErrorCode;
  /** Spanish message shown to the user. */
  message: string;
}
/** Result of ending a mock session. */
export interface SignOutResult {
  /** Whether the session was removed. */
  success: boolean;
}
/** Inline registration feedback keyed by field. */
export interface AuthFieldErrors {
  /** Name validation message. */
  fullName?: string;
  /** Email validation message. */
  email?: string;
  /** Password validation message. */
  password?: string;
}

/** Public study preview shown before authentication. */
export interface StudyPreviewData {
  /** Reference illustration bundled locally. */
  image: ImageSourcePropType;
  /** Recommendation description from mock study data. */
  description: string;
  /** Subjects offered by the personalized study plan. */
  planDescription: string;
}
