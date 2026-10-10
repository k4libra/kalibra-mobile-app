/**
 * Account-scoped simulated authentication and profile endpoints.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthServiceContract } from '@/services/auth.contract';
import type { AuthErrorCode, AuthSession, AuthUser, ProfilePreferences } from '@/types/auth';
import { AUTH_MESSAGES, isInstitutionalEmail, validateRegistration } from '@/utils/auth';
import { respond, isEmptyScenario } from '@/mocks/scenario';
import { getMockSession, getSessionRevision, setMockSession } from '@/mocks/session.mock';
/** Demo identity represented in the supplied profile frame. */
export const MOCK_AUTH_USER: AuthUser = {
  id: 'student-1', fullName: 'Valentina Morales Rivera', email: 'v.morales@upc.edu.pe', role: 'student',
  faculty: 'Facultad de Ingeniería', semester: 'Semestre IV',
};
/** Local mock credentials, never valid against a real backend. */
export const DEMO_CREDENTIALS = { email: MOCK_AUTH_USER.email, password: 'Kalibra2025!', rememberDevice: false };
/** Default settings copied independently into each account. */
export const MOCK_PROFILE_PREFERENCES: ProfilePreferences = { darkMode: false, dailyReminders: true };
interface MockAccount { user: AuthUser; password: string; preferences: ProfilePreferences }
const accounts = new Map<string, MockAccount>();
function fail(code: AuthErrorCode): never { throw Object.assign(new Error(AUTH_MESSAGES[code]), { code }); }
function accountForSession() {
  const session = getMockSession();
  if (!session) return fail('UNAUTHORIZED');
  const account = accounts.get(session.user.email);
  if (!account) return fail('UNAUTHORIZED');
  return { account, session };
}
function createSession(user: AuthUser): AuthSession { return { user, accessToken: `mock-${user.id}-${getSessionRevision()}` }; }
/**
 * Restores independent demo fixtures for tests and local previews.
 * @returns Nothing; the app starts signed out.
 */
export function resetAuthMock(): void {
  accounts.clear();
  accounts.set(MOCK_AUTH_USER.email, { user: MOCK_AUTH_USER, password: DEMO_CREDENTIALS.password, preferences: { ...MOCK_PROFILE_PREFERENCES } });
  setMockSession(null);
}
resetAuthMock();
/** Implements {@link AuthServiceContract} using local accounts and shared mock scenarios. */
export const authMock: AuthServiceContract = {
  /** {@inheritDoc AuthServiceContract.getStudyPreview} */
  getStudyPreview: () => respond({ image: require('@/assets/images/study-preview.png'), description: 'Tu sesión de Optimización Lineal te espera.', planDescription: 'Cálculo, Álgebra Lineal y Algoritmos' }),
  /** {@inheritDoc AuthServiceContract.signUp} */
  async signUp(data) {
    const revision = getSessionRevision();
    await respond(null);
    if (revision !== getSessionRevision()) return fail('UNAUTHORIZED');
    const errors = validateRegistration(data);
    if (errors.fullName) return fail('REQUIRED_FIELD');
    if (errors.email) return fail('INVALID_EMAIL');
    if (errors.password) return fail('INVALID_PASSWORD');
    const email = data.email.trim().toLowerCase();
    if (accounts.has(email)) return fail('EMAIL_ALREADY_REGISTERED');
    const user: AuthUser = { id: `student-${accounts.size + 1}`, fullName: data.fullName.trim(), email, role: 'student', faculty: '', semester: '' };
    accounts.set(email, { user, password: data.password, preferences: { ...MOCK_PROFILE_PREFERENCES } });
    const session = createSession(user);
    setMockSession(session);
    return session;
  },
  /** {@inheritDoc AuthServiceContract.signIn} */
  async signIn(credentials) {
    const revision = getSessionRevision();
    await respond(null);
    if (revision !== getSessionRevision()) return fail('UNAUTHORIZED');
    if (!credentials.email.trim() || !credentials.password) return fail('REQUIRED_FIELD');
    if (!isInstitutionalEmail(credentials.email)) return fail('INVALID_EMAIL');
    const account = accounts.get(credentials.email.trim().toLowerCase());
    if (!account || account.password !== credentials.password) return fail('INVALID_CREDENTIALS');
    const session = createSession(account.user);
    setMockSession(session);
    return session;
  },
  /** {@inheritDoc AuthServiceContract.signOut} */
  signOut() { setMockSession(null); return respond({ success: true }); },
  /** {@inheritDoc AuthServiceContract.getCurrentSession} */
  getCurrentSession: () => respond(getMockSession()),
  /** {@inheritDoc AuthServiceContract.getProfile} */
  async getProfile() {
    const { account, session } = accountForSession();
    const hasActivity = account.user.id === MOCK_AUTH_USER.id && !isEmptyScenario();
    return respond({ user: session.user, stats: { solvedExerciseCount: hasActivity ? 77 : 0, averageMastery: hasActivity ? 71 : null, activeCourseCount: hasActivity ? 3 : 0 }, preferences: { ...account.preferences } });
  },
  /** {@inheritDoc AuthServiceContract.updatePreferences} */
  async updatePreferences(preferences) {
    const { account, session } = accountForSession();
    await respond(null);
    if (getMockSession() !== session) return fail('UNAUTHORIZED');
    account.preferences = { ...account.preferences, ...preferences };
    return { ...account.preferences };
  },
};
