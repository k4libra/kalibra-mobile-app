/**
 * Authentication and profile service boundary.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthSession, ProfilePreferences, SignInCredentials, SignOutResult, SignUpData, StudentProfile, StudyPreviewData } from '@/types/auth';
/** Contract implemented by HTTP authentication endpoints. */
export interface AuthServiceContract {
  /**
   * Loads the public study preview shown at account access.
   * @returns An illustration and generic study recommendation.
   * @throws Error when the preview cannot be loaded.
   */
  getStudyPreview(): Promise<StudyPreviewData>;
  /**
   * Registers and signs in a new student.
   * @param data - Validated name, institutional email and password.
   * @returns A session for an account with no academic activity.
   * @throws Error with a domain code when validation fails or the email already exists.
   */
  signUp(data: SignUpData): Promise<AuthSession>;
  /**
   * Authenticates an existing account.
   * @param credentials - Institutional email, password and persistence preference.
   * @returns The authenticated session.
   * @throws Error with a domain code when credentials are invalid or the request is obsolete.
   */
  signIn(credentials: SignInCredentials): Promise<AuthSession>;
  /**
   * Expires the native token cookie.
   * @returns A successful logout result.
   * @throws Error when the endpoint is unavailable.
   */
  signOut(): Promise<SignOutResult>;
  /**
   * Restores the cookie session through users/me.
   * @returns The session or null when signed out.
   * @throws Error when restoration is unavailable.
   */
  getCurrentSession(): Promise<AuthSession | null>;
  /**
   * Loads identity, academic totals and preferences.
   * @returns The current account profile.
   * @throws Error with UNAUTHORIZED when there is no session.
   */
  getProfile(): Promise<StudentProfile>;
  /**
   * Patches the preferences of the request's account.
   * @param preferences - Learning settings to change.
   * @returns The complete updated preferences.
   * @throws Error with UNAUTHORIZED when the session ends before completion.
   */
  updatePreferences(preferences: Partial<ProfilePreferences>): Promise<ProfilePreferences>;
}
