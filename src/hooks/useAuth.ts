
import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

/**
 * Provides access to the global authentication state.
 *
 * Must be used inside AuthProvider.
 *
 * @example
 * const { signIn, isSubmitting, error } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider.',
        );
    }

    return context;
}
