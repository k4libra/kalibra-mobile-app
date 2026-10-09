
import type {
    AuthError,
    AuthErrorCode,
    AuthSession,
    AuthUser,
    ProfilePreferences,
    SignInCredentials,
    SignOutResult,
    SignUpData,
    StudentProfile,
} from '@/types/auth';

import type { AuthServiceContract } from './auth.contract';

import {
    MOCK_AUTH_MESSAGES,
    MOCK_AUTH_USER,
    MOCK_INITIAL_SESSION,
    MOCK_PROFILE_PREFERENCES,
    MOCK_REGISTERED_EMAIL,
    MOCK_STUDENT_PROFILE,
} from '@/mocks/auth.mock';

/**
 * Simulated API response delay.
 */
const MOCK_DELAY_MS = 300;

/**
 * Demo password used only by this local mock service.
 * Never use this approach for real authentication.
 */
const DEMO_PASSWORD = 'Kalibra2025!';

type MockAccount = {
    user: AuthUser;
    password: string;
};

const accounts = new Map<string, MockAccount>([
    [
        MOCK_REGISTERED_EMAIL.toLowerCase(),
        {
            user: MOCK_AUTH_USER,
            password: DEMO_PASSWORD,
        },
    ],
]);

let currentSession: AuthSession | null = MOCK_INITIAL_SESSION;

let currentPreferences: ProfilePreferences = {
    ...MOCK_PROFILE_PREFERENCES,
};

function delay(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, MOCK_DELAY_MS);
    });
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/**
 * Accepts institutional email domains such as:
 * - estudiante@upc.edu.pe
 * - estudiante@universidad.edu
 */
function isInstitutionalEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.edu(?:\.[a-z]{2,})?$/i.test(email);
}

function createAuthError(code: AuthErrorCode): Error & AuthError {
    const messages: Record<AuthErrorCode, string> = {
        INVALID_EMAIL: MOCK_AUTH_MESSAGES.invalidEmail,
        EMAIL_ALREADY_REGISTERED:
        MOCK_AUTH_MESSAGES.emailAlreadyRegistered,
        INVALID_CREDENTIALS:
        MOCK_AUTH_MESSAGES.invalidCredentials,
        INVALID_PASSWORD: MOCK_AUTH_MESSAGES.invalidPassword,
        REQUIRED_FIELD: MOCK_AUTH_MESSAGES.requiredField,
        UNAUTHORIZED: MOCK_AUTH_MESSAGES.unauthorized,
        UNKNOWN_ERROR: MOCK_AUTH_MESSAGES.unknownError,
    };

    return Object.assign(new Error(messages[code]), {
        code,
    });
}

function createMockSession(user: AuthUser): AuthSession {
    return {
        user,
        accessToken: 'mock-session-token',
    };
}

function requireSession(): AuthSession {
    if (!currentSession) {
        throw createAuthError('UNAUTHORIZED');
    }

    return currentSession;
}

/**
 * Authentication and profile mock service.
 *
 * All state is stored in memory and resets when
 * the JavaScript runtime restarts.
 */
export const authService: AuthServiceContract = {
    async signUp(data: SignUpData): Promise<AuthSession> {
        await delay();

        const fullName = data.fullName.trim();
        const email = normalizeEmail(data.email);
        const password = data.password;

        if (!fullName || !email || !password) {
            throw createAuthError('REQUIRED_FIELD');
        }

        if (!isInstitutionalEmail(email)) {
            throw createAuthError('INVALID_EMAIL');
        }

        if (accounts.has(email)) {
            throw createAuthError('EMAIL_ALREADY_REGISTERED');
        }

        if (password.length < 8) {
            throw createAuthError('INVALID_PASSWORD');
        }

        const user: AuthUser = {
            id: `student-${accounts.size + 1}`,
            fullName,
            email,
            role: 'student',
            faculty: '',
            semester: '',
        };

        accounts.set(email, {
            user,
            password,
        });

        currentSession = createMockSession(user);

        currentPreferences = {
            ...MOCK_PROFILE_PREFERENCES,
        };

        return currentSession;
    },

    async signIn(
        credentials: SignInCredentials,
    ): Promise<AuthSession> {
        await delay();

        const email = normalizeEmail(credentials.email);
        const password = credentials.password;

        if (!email || !password) {
            throw createAuthError('REQUIRED_FIELD');
        }

        if (!isInstitutionalEmail(email)) {
            throw createAuthError('INVALID_EMAIL');
        }

        const account = accounts.get(email);

        if (!account || account.password !== password) {
            throw createAuthError('INVALID_CREDENTIALS');
        }

        currentSession = createMockSession(account.user);

        // rememberDevice is part of the future backend contract.
        // This mock does not persist credentials or sessions.

        return currentSession;
    },

    async signOut(): Promise<SignOutResult> {
        await delay();

        currentSession = null;

        return {
            success: true,
        };
    },

    async getCurrentSession(): Promise<AuthSession | null> {
        await delay();

        return currentSession;
    },

    async getProfile(): Promise<StudentProfile> {
        await delay();

        const session = requireSession();

        return {
            user: session.user,

            stats:
                session.user.id === MOCK_AUTH_USER.id
                    ? { ...MOCK_STUDENT_PROFILE.stats }
                    : {
                        solvedExerciseCount: 0,
                        averageMastery: null,
                        activeCourseCount: 0,
                    },

            preferences: {
                ...currentPreferences,
            },
        };
    },

    async updatePreferences(
        preferences: Partial<ProfilePreferences>,
    ): Promise<ProfilePreferences> {
        await delay();

        requireSession();

        currentPreferences = {
            ...currentPreferences,
            ...preferences,
        };

        return {
            ...currentPreferences,
        };
    },
};
