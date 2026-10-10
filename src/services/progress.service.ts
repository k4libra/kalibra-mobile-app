/**
 * Progress service used by the hooks.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { progressMock } from '@/mocks/progress.mock';
import type { ProgressContract } from './progress.contract';

/**
 * Reads the course progress and the practice history of the student.
 *
 * @remarks
 * Points to the simulated implementation until the backend integration is built.
 */
export const progressService: ProgressContract = progressMock;
