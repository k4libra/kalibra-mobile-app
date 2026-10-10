/**
 * Shared cookie session state and startup restoration.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React, { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { subscribeSession } from '@/services/http/session';
import type { AuthSession } from '@/types/auth';
/** Session state consumed by the navigation guard and account-bound hooks. */
export interface AuthContextValue {
  /** Active account or null when signed out. */
  session: AuthSession | null;
  /** Whether startup restoration is still running. */
  isLoading: boolean;
  /** Publishes a session and invalidates pending startup restoration. */
  setSession: (session: AuthSession | null) => void;
}
/** Shared session boundary; consumers access it through useAuth. */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
/** Props accepted by {@link AuthProvider}. */
export interface AuthProviderProps {
  /** Application subtree that requires session state. */
  children: ReactNode;
}
/** Provides the cookie session and restores it once at application startup. */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, publish] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const generation = useRef(0);
  const setSession = useCallback((next: AuthSession | null) => {
    generation.current += 1;
    publish(next);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    const unsubscribe = subscribeSession(next => {
      if (next === null) setSession(null);
    });
    return unsubscribe;
  }, [setSession]);
  useEffect(() => {
    let mounted = true;
    const request = generation.current;
    authService.getCurrentSession().then(next => {
      if (mounted && request === generation.current) { publish(next); setIsLoading(false); }
    }).catch(() => { if (mounted && request === generation.current) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);
  const value = useMemo(() => ({ session, isLoading, setSession }), [session, isLoading, setSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
