/**
 * HTTP implementation of the authentication and profile service contract.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthServiceContract } from '@/services/auth.contract';
import type { UserDto, PreferencesDto, HistoryDto } from '@/types/api';
import type { AuthSession, SignInCredentials } from '@/types/auth';
import { apiClient, ApiError } from '@/services/http/apiClient';
import {
  getSession,
  getSessionRevision,
  setSession,
} from '@/services/http/session';
import { getProgress, listEnrolledCourses } from '@/services/http/studentData';
import { mapPreferences, mapSession } from '@/services/mappers/auth';
import { averageMastery } from '@/services/mappers/courses';
import { isInstitutionalEmail, validateRegistration } from '@/utils/auth';

async function signIn(input: SignInCredentials): Promise<AuthSession> {
  const revision = getSessionRevision();
  if (!input.email.trim() || !input.password)
    throw new ApiError(400, 'REQUIRED_FIELD');
  if (!isInstitutionalEmail(input.email))
    throw new ApiError(400, 'INVALID_EMAIL');
  const dto = await apiClient.post<UserDto>(
    '/authentication/sign-in',
    {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      application: 'MOBILE_APP',
    },
    { auth: true },
  );
  if (revision !== getSessionRevision())
    throw new ApiError(401, 'UNAUTHORIZED');
  if (!dto.roles.includes('STUDENT'))
    throw new ApiError(403, 'MOBILE_ACCESS_DENIED');
  const session = mapSession(dto);
  setSession(session);
  return session;
}
/** Implements authentication, profile totals and persisted preferences through HTTP. */
export const authService: AuthServiceContract = {
  /** {@inheritDoc AuthServiceContract.getStudyPreview} */
  getStudyPreview: async () => ({
    image: require('@/assets/images/study-preview.png'),
    description: 'Tu próxima sesión de práctica te espera.',
    planDescription: 'Aprende y refuerza los subtemas de tus cursos.',
  }),
  /** {@inheritDoc AuthServiceContract.signIn} */
  signIn,
  /** {@inheritDoc AuthServiceContract.signUp} */
  async signUp(data) {
    const revision = getSessionRevision();
    const errors = validateRegistration(data);
    if (errors.fullName) throw new ApiError(400, 'REQUIRED_FIELD');
    if (errors.email) throw new ApiError(400, 'INVALID_EMAIL');
    if (errors.password) throw new ApiError(400, 'INVALID_PASSWORD');
    const [firstName, ...lastNames] = data.fullName.trim().split(/\s+/);
    await apiClient.post<UserDto>(
      '/authentication/sign-up',
      {
        firstName,
        lastName: lastNames.join(' '),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        application: 'MOBILE_APP',
      },
      { auth: true },
    );
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    // Registration returns an identity, but only sign-in issues the cookie.
    return signIn({ ...data, rememberDevice: false });
  },
  /** {@inheritDoc AuthServiceContract.signOut} */
  async signOut() {
    setSession(null);
    await apiClient.post<void>('/authentication/sign-out', undefined, {
      auth: true,
    });
    return { success: true };
  },
  /** {@inheritDoc AuthServiceContract.getCurrentSession} */
  async getCurrentSession() {
    const revision = getSessionRevision();
    try {
      const dto = await apiClient.get<UserDto>('/users/me', { auth: true });
      if (revision !== getSessionRevision()) return getSession();
      if (!dto.roles.includes('STUDENT')) return null;
      const session = mapSession(dto);
      setSession(session);
      return session;
    } catch (reason: unknown) {
      if (reason instanceof ApiError && reason.status === 401) {
        if (revision === getSessionRevision()) setSession(null);
        return null;
      }
      throw reason;
    }
  },
  /** {@inheritDoc AuthServiceContract.getProfile} */
  async getProfile() {
    const revision = getSessionRevision();
    const session = getSession();
    if (!session) throw new ApiError(401, 'UNAUTHORIZED');
    const [courses, preferences] = await Promise.all([
      listEnrolledCourses(),
      apiClient.get<PreferencesDto>('/student-preferences/me'),
    ]);
    const activity = await Promise.all(
      courses.map(async course => {
        const [history, progress] = await Promise.all([
          apiClient.get<HistoryDto>(
            `/exercise-attempts?courseId=${encodeURIComponent(
              course.courseId,
            )}&result=ALL&page=0&size=1`,
          ),
          getProgress(course.courseId),
        ]);
        return {
          count: history.allCount,
          masteries: progress.hasActivity
            ? progress.subtopics.map(item => item.mastery)
            : [],
        };
      }),
    );
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    return {
      user: session.user,
      preferences: mapPreferences(preferences),
      stats: {
        solvedExerciseCount: activity.reduce(
          (sum, item) => sum + item.count,
          0,
        ),
        averageMastery: averageMastery(
          activity.flatMap(item => item.masteries),
        ),
        activeCourseCount: courses.length,
      },
    };
  },
  /** {@inheritDoc AuthServiceContract.updatePreferences} */
  async updatePreferences(preferences) {
    const revision = getSessionRevision();
    let dto = await apiClient.get<PreferencesDto>('/student-preferences/me');
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    const changes: Partial<PreferencesDto> = {};
    if (preferences.dailyReminders !== undefined) {
      changes.dailyReminderEnabled = preferences.dailyReminders;
      if (preferences.dailyReminders)
        changes.dailyReminderTime = dto.dailyReminderTime ?? '20:00:00';
    }
    if (preferences.darkMode !== undefined)
      changes.darkMode = preferences.darkMode;
    if (Object.keys(changes).length)
      dto = await apiClient.patch<PreferencesDto>('/student-preferences/me', changes);
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    return mapPreferences(dto);
  },
};
