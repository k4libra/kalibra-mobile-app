/**
 * Account-bound profile reads, preference actions and logout confirmation.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useResource } from '@/hooks/useResource';
import { authService } from '@/services/auth.service';
import type { ProfilePreferences } from '@/types/auth';
import { normalizeAuthError } from '@/utils/auth';
/**
 * Loads the active profile and handles account-scoped preferences and logout.
 * @returns The `profile`, `isLoading`, `isSubmitting`, `error`, preference setters, dialog actions and `refetch`.
 *
 * @example
 * ```tsx
 * const { profile, setDarkMode, requestSignOut } = useProfile();
 * ```
 */
export function useProfile() {
  const { session, signOut } = useAuth();
  const resource = useResource(authService.getProfile, `profile-${session?.user.id}`, true);
  const [preferences, setPreferences] = useState<ProfilePreferences | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSignOutVisible, setSignOutVisible] = useState(false);
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  const pending = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { setPreferences(null); setActionError(null); setSignOutVisible(false); }, [session]);
  const update = useCallback(async (patch: Partial<ProfilePreferences>) => {
    if (pending.current) return;
    pending.current = true;
    const identity = current.current;
    setIsSubmitting(true); setActionError(null);
    try {
      const next = await authService.updatePreferences(patch);
      if (mounted.current && current.current === identity) setPreferences(next);
    } catch (reason: unknown) {
      if (mounted.current && current.current === identity) setActionError(normalizeAuthError(reason).message);
    } finally { pending.current = false; if (mounted.current) setIsSubmitting(false); }
  }, []);
  const setDarkMode = useCallback((value: boolean) => update({ darkMode: value }), [update]);
  const setDailyReminders = useCallback((value: boolean) => update({ dailyReminders: value }), [update]);
  const requestSignOut = useCallback(() => setSignOutVisible(true), []);
  const cancelSignOut = useCallback(() => setSignOutVisible(false), []);
  const confirmSignOut = useCallback(() => { setSignOutVisible(false); return signOut(); }, [signOut]);
  const profile = resource.data ? { ...resource.data, preferences: preferences ?? resource.data.preferences } : null;
  return { profile, isLoading: resource.isLoading, error: resource.error ?? actionError, isSubmitting,
    setDarkMode, setDailyReminders, isSignOutVisible, requestSignOut, cancelSignOut, confirmSignOut, refetch: resource.refetch };
}
