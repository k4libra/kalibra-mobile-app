
/**
 * Mock data for authentication and student profile.
 *
 * These values are used during frontend development.
 * They will be replaced by backend responses later.
 *
 * @packageDocumentation
 */

import type {
    AuthSession,
    AuthUser,
    ProfilePreferences,
    StudentProfile,
} from '@/types/auth';

import {
    COURSES,
    STUDENT,
} from '@/mocks/courses.mock';

/**
 * Demo account shown in the Figma designs.
 */
export const MOCK_AUTH_USER: AuthUser = {
    id: 'student-1',
    fullName: 'Valentina Morales Rivera',
    email: 'v.morales@upc.edu.pe',
    role: 'student',
    faculty: 'Facultad de Ingeniería',
    semester: 'Semestre IV',
};

/**
 * Default learning preferences.
 */
export const MOCK_PROFILE_PREFERENCES: ProfilePreferences = {
    darkMode: false,
    dailyReminders: true,
};

/**
 * Demo profile.
 *
 * Academic statistics are reused from the existing
 * student and course mocks to avoid duplicating values.
 */
export const MOCK_STUDENT_PROFILE: StudentProfile = {
    user: MOCK_AUTH_USER,

    stats: {
        solvedExerciseCount: STUDENT.solvedExerciseCount,
        averageMastery: STUDENT.averageMastery,
        activeCourseCount: COURSES.filter(
            (course) => course.solvedExerciseCount > 0,
        ).length,
    },

    preferences: {
        ...MOCK_PROFILE_PREFERENCES,
    },
};

/**
 * Simulated authentication session.
 *
 * This token is a placeholder only. It must never
 * be accepted as a real authentication credential.
 */
export const MOCK_AUTH_SESSION: AuthSession = {
    user: MOCK_AUTH_USER,
    accessToken: 'mock-session-token',
};

/**
 * Initial authentication state.
 *
 * The user starts signed out so the SignIn screen
 * can be tested.
 */
export const MOCK_INITIAL_SESSION: AuthSession | null = null;

/**
 * Demo account identifier for the future mock service.
 *
 * No password is stored in this file.
 */
export const MOCK_REGISTERED_EMAIL = MOCK_AUTH_USER.email;

/**
 * Error messages matching the Figma states.
 */
export const MOCK_AUTH_MESSAGES = {
    invalidEmail:
        'Ingresa un correo institucional válido (@universidad.edu).',

    emailAlreadyRegistered:
        'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.',

    invalidCredentials:
        'Verifica tu correo o contraseña e inténtalo nuevamente. Recuerda usar tu cuenta institucional.',

    invalidPassword:
        'La contraseña debe tener al menos 8 caracteres.',

    requiredField:
        'Este campo es obligatorio.',

    unauthorized:
        'Tu sesión no está disponible. Inicia sesión nuevamente.',

    unknownError:
        'Ocurrió un error inesperado. Inténtalo nuevamente.',
} as const;
