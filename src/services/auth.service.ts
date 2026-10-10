/**
 * Selected implementation of the authentication service contract.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthServiceContract } from '@/services/auth.contract';
import { authMock } from '@/mocks/auth.mock';
/** Provides the authentication and profile endpoints through their contract. */
export const authService: AuthServiceContract = authMock;
