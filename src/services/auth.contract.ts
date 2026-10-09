
import type {
    AuthSession,
    ProfilePreferences,
    SignInCredentials,
    SignOutResult,
    SignUpData,
    StudentProfile,
} from '@/types/auth';

/**
 * Contract for authentication operations.
 *
 * The implementation can use mock data during
 * development and a real API in the future.
 */
export interface AuthServiceContract {
    /**
     * Registers a new student account.
     *
     * Throws an error if:
     * - A required field is missing.
     * - The institutional email is invalid.
     * - The email is already registered.
     * - The password does not meet requirements.
     */
    signUp(data: SignUpData): Promise<AuthSession>;

    /**
     * Signs in with institutional credentials.
     *
     * Throws an error when credentials are invalid.
     */
    signIn(
        credentials: SignInCredentials,
    ): Promise<AuthSession>;

    /**
     * Signs out the current user.
     */
    signOut(): Promise<SignOutResult>;

    /**
     * Returns the current session, if available.
     */
    getCurrentSession(): Promise<AuthSession | null>;

    /**
     * Returns the authenticated student's profile.
     */
    getProfile(): Promise<StudentProfile>;

    /**
     * Updates learning preferences.
     *
     * Supports changing dark mode and daily reminders.
     */
    updatePreferences(
        preferences: Partial<ProfilePreferences>,
    ): Promise<ProfilePreferences>;
}
