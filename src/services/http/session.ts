/**
 * Tracks session identity and invalidates account-scoped requests without storing credentials.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AuthSession } from '@/types/auth';
let session: AuthSession | null = null;
let revision = 0;
const listeners = new Set<(next: AuthSession | null) => void>();
/**
 * Returns the public identity associated with the native cookie session.
 *
 * @returns Public account identity or null when signed out.
 */
export function getSession(): AuthSession | null {
  return session;
}
/**
 * Returns the generation used to discard responses from previous sessions.
 *
 * @returns The current session generation.
 */
export function getSessionRevision(): number {
  return revision;
}
/**
 * Publishes an identity change and invalidates pending account requests.
 *
 * @param next - Public identity to publish, or null to clear it.
 * @returns Nothing; account-scoped listeners are notified synchronously.
 */
export function setSession(next: AuthSession | null): void {
  const sameAccount = session !== null && next !== null && session.user.id === next.user.id;
  session = next;
  // A refresh of the same account keeps account-scoped caches and in-flight requests valid.
  if (sameAccount) return;
  revision += 1;
  listeners.forEach(listener => listener(next));
}
/**
 * Subscribes to identity changes; returns a cleanup function.
 *
 * @param listener - Callback notified after a session change.
 * @returns A cleanup function that removes the callback.
 */
export function subscribeSession(
  listener: (next: AuthSession | null) => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
