
import { useCallback } from 'react';

import { useAuth } from './useAuth';

import type {
    ProfilePreferences,
    ProfileStats,
} from '../types/auth';

/**
 * Hook for accessing and managing the
 * authenticated student's profile.
 */
export function useProfile() {
    const {
        profile,
        isAuthenticated,
        isLoading,
        isSubmitting,
        error,
        refreshProfile,
        updatePreferences,
        clearError,
    } = useAuth();

    const stats: ProfileStats | null =
        profile?.stats ?? null;

    const preferences: ProfilePreferences | null =
        profile?.preferences ?? null;

    /**
     * Enables or disables dark mode.
     */
    const setDarkMode = useCallback(
        async (enabled: boolean) => {
            await updatePreferences({
                darkMode: enabled,
            });
        },
        [updatePreferences],
    );

    /**
     * Enables or disables daily reminders.
     */
    const setDailyReminders = useCallback(
        async (enabled: boolean) => {
            await updatePreferences({
                dailyReminders: enabled,
            });
        },
        [updatePreferences],
    );

    return {
        user: profile?.user ?? null,
        profile,
        stats,
        preferences,

        isAuthenticated,
        isLoading,
        isSubmitting,
        error,

        refreshProfile,
        updatePreferences,
        setDarkMode,
        setDailyReminders,
        clearError,
    };
}
