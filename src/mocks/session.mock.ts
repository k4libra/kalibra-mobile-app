/**
 * Shared in-memory account identity for simulated endpoints.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AuthSession } from '@/types/auth';
let session: AuthSession | null = null;
let revision = 0;
/**
 * Returns the session captured by an endpoint at request time.
 * @returns The authenticated account or null.
 */
export function getMockSession(): AuthSession | null { return session; }
/**
 * Returns the generation used to discard obsolete authentication requests.
 * @returns The current session generation.
 */
export function getSessionRevision(): number { return revision; }
/**
 * Changes the shared mock identity and invalidates pending requests.
 * @param next - New session or null after logout.
 * @returns Nothing.
 */
export function setMockSession(next: AuthSession | null): void { session = next; revision += 1; }
/**
 * Recognizes the account that owns the demo fixtures.
 * @returns Whether the current session belongs to the demo student.
 */
export function hasDemoSession(): boolean { return session?.user.id === 'student-1'; }
