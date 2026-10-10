/**
 * Authentication actions and access to the shared session.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import type { AuthError, SignInCredentials, SignUpData } from '@/types/auth';
import { normalizeAuthError } from '@/utils/auth';
/**
 * Reads the session and exposes normalized authentication actions.
 * @returns The `session`, `isAuthenticated`, `isLoading`, `isSubmitting`, `error`, `signIn`, `signUp`, `signOut` and `clearError`.
 * @throws Error when used outside {@link AuthProvider}.
 *
 * @example
 * ```tsx
 * const { signIn, error } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth requires AuthProvider.');
  const { session, isLoading, setSession } = context;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const mounted = useRef(true);
  const pending = useRef(false);
  const currentSession = useRef(session);
  currentSession.current = session;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const clearError = useCallback(() => setError(null), []);
  const run = useCallback(async (action: () => Promise<import('@/types/auth').AuthSession | null>) => {
    if (pending.current) return null;
    pending.current = true;
    setIsSubmitting(true); setError(null);
    const startingSession = currentSession.current;
    try {
      const next = await action();
      if (!mounted.current || currentSession.current !== startingSession) return null;
      setSession(next);
      return next;
    } catch (reason: unknown) {
      if (mounted.current && currentSession.current === startingSession) setError(normalizeAuthError(reason));
      return null;
    } finally {
      pending.current = false;
      if (mounted.current) setIsSubmitting(false);
    }
  }, [setSession]);
  const signIn = useCallback((input: SignInCredentials) => run(() => authService.signIn(input)), [run]);
  const signUp = useCallback((input: SignUpData) => run(() => authService.signUp(input)), [run]);
  const signOut = useCallback(async () => {
    clearError();
    // Remove authenticated navigation immediately; delayed responses cannot restore it.
    setSession(null);
    try { await authService.signOut(); } catch (reason: unknown) { if (mounted.current) setError(normalizeAuthError(reason)); }
  }, [clearError, setSession]);
  return { session, isAuthenticated: Boolean(session), isLoading, isSubmitting, error, signIn, signUp, signOut, clearError };
}
