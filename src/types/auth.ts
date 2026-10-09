
/**
 * Domain types for authentication and student profile.
 *
 * These contracts support mock services and future backend integration.
 *
 * @packageDocumentation
 */

/**
 * Authenticated user roles.
 */
export type AuthRole = 'student';

/**
 * Student account information.
 * Passwords must never be included in this model.
 */
export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: AuthRole;
    faculty: string;
    semester: string;
}

/**
 * Credentials required to sign in.
 */
export interface SignInCredentials {
    email: string;
    password: string;
    rememberDevice: boolean;
}

/**
 * Data required to register a new student.
 */
export interface SignUpData {
    fullName: string;
    email: string;
    password: string;
}

/**
 * Session returned after successful authentication.
 */
export interface AuthSession {
    user: AuthUser;
    accessToken: string;
}

/**
 * Student profile statistics.
 */
export interface ProfileStats {
    solvedExerciseCount: number;
    averageMastery: number | null;
    activeCourseCount: number;
}

/**
 * Student learning preferences.
 */
export interface ProfilePreferences {
    darkMode: boolean;
    dailyReminders: boolean;
}

/**
 * Complete profile information.
 */
export interface StudentProfile {
    user: AuthUser;
    stats: ProfileStats;
    preferences: ProfilePreferences;
}

/**
 * Supported authentication error codes.
 */
export type AuthErrorCode =
    | 'INVALID_EMAIL'
    | 'EMAIL_ALREADY_REGISTERED'
    | 'INVALID_CREDENTIALS'
    | 'INVALID_PASSWORD'
    | 'REQUIRED_FIELD'
    | 'UNAUTHORIZED'
    | 'UNKNOWN_ERROR';

/**
 * Error structure for authentication operations.
 */
export interface AuthError {
    code: AuthErrorCode;
    message: string;
}

/**
 * Authentication state used by the application.
 */
export interface AuthState {
    session: AuthSession | null;
    isLoading: boolean;
    error: AuthError | null;
}

/**
 * Result returned when a user signs out.
 */
export interface SignOutResult {
    success: boolean;
}
