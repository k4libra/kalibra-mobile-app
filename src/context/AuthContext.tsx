
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { authService } from '../services/auth.service';

import type {
    AuthError,
    AuthErrorCode,
    AuthSession,
    ProfilePreferences,
    SignInCredentials,
    SignUpData,
    StudentProfile,
} from '../types/auth';

interface AuthContextValue {
    session: AuthSession | null;
    profile: StudentProfile | null;

    isAuthenticated: boolean;
    isLoading: boolean;
    isSubmitting: boolean;

    error: AuthError | null;

    signIn: (credentials: SignInCredentials) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;

    refreshProfile: () => Promise<void>;

    updatePreferences: (
        preferences: Partial<ProfilePreferences>,
    ) => Promise<void>;

    clearError: () => void;
}

export const AuthContext = createContext<
    AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

function normalizeAuthError(error: unknown): AuthError {
    if (error instanceof Error) {
        const candidate = error as Error & {
            code?: AuthErrorCode;
        };

        return {
            code: candidate.code ?? 'UNKNOWN_ERROR',
            message: candidate.message,
        };
    }

    return {
        code: 'UNKNOWN_ERROR',
        message: 'Ocurrió un error inesperado.',
    };
}

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [session, setSession] = useState<AuthSession | null>(
        null,
    );

    const [profile, setProfile] = useState<StudentProfile | null>(
        null,
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<AuthError | null>(null);

    /**
     * Restores the current mock session on startup.
     */
    useEffect(() => {
        let mounted = true;

        async function restoreSession() {
            try {
                const currentSession =
                    await authService.getCurrentSession();

                if (!mounted) return;

                setSession(currentSession);

                if (currentSession) {
                    const currentProfile =
                        await authService.getProfile();

                    if (mounted) {
                        setProfile(currentProfile);
                    }
                }
            } catch (caughtError) {
                if (mounted) {
                    setSession(null);
                    setProfile(null);
                    setError(normalizeAuthError(caughtError));
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        void restoreSession();

        return () => {
            mounted = false;
        };
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Signs in and loads the authenticated profile.
     */
    const signIn = useCallback(
        async (credentials: SignInCredentials) => {
            setIsSubmitting(true);
            setError(null);

            try {
                const newSession =
                    await authService.signIn(credentials);

                const newProfile =
                    await authService.getProfile();

                setSession(newSession);
                setProfile(newProfile);
            } catch (caughtError) {
                const authError = normalizeAuthError(caughtError);

                setError(authError);
                throw authError;
            } finally {
                setIsSubmitting(false);
            }
        },
        [],
    );

    /**
     * Registers a student and starts their session.
     */
    const signUp = useCallback(
        async (data: SignUpData) => {
            setIsSubmitting(true);
            setError(null);

            try {
                const newSession =
                    await authService.signUp(data);

                const newProfile =
                    await authService.getProfile();

                setSession(newSession);
                setProfile(newProfile);
            } catch (caughtError) {
                const authError = normalizeAuthError(caughtError);

                setError(authError);
                throw authError;
            } finally {
                setIsSubmitting(false);
            }
        },
        [],
    );

    /**
     * Signs out and clears local authentication state.
     */
    const signOut = useCallback(async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            await authService.signOut();

            setSession(null);
            setProfile(null);
        } catch (caughtError) {
            const authError = normalizeAuthError(caughtError);

            setError(authError);
            throw authError;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    /**
     * Refreshes the student's profile.
     */
    const refreshProfile = useCallback(async () => {
        if (!session) return;

        setError(null);

        try {
            const updatedProfile =
                await authService.getProfile();

            setProfile(updatedProfile);
        } catch (caughtError) {
            const authError = normalizeAuthError(caughtError);

            setError(authError);
            throw authError;
        }
    }, [session]);

    /**
     * Updates the student's learning preferences.
     */
    const updatePreferences = useCallback(
        async (preferences: Partial<ProfilePreferences>) => {
            setIsSubmitting(true);
            setError(null);

            try {
                const updatedPreferences =
                    await authService.updatePreferences(preferences);

                setProfile((currentProfile) => {
                    if (!currentProfile) return null;

                    return {
                        ...currentProfile,
                        preferences: updatedPreferences,
                    };
                });
            } catch (caughtError) {
                const authError = normalizeAuthError(caughtError);

                setError(authError);
                throw authError;
            } finally {
                setIsSubmitting(false);
            }
        },
        [],
    );

    const value = useMemo<AuthContextValue>(
        () => ({
            session,
            profile,

            isAuthenticated: session !== null,
            isLoading,
            isSubmitting,

            error,

            signIn,
            signUp,
            signOut,

            refreshProfile,
            updatePreferences,
            clearError,
        }),
        [
            session,
            profile,
            isLoading,
            isSubmitting,
            error,
            signIn,
            signUp,
            signOut,
            refreshProfile,
            updatePreferences,
            clearError,
        ],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
