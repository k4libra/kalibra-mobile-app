/**
 * Adaptive practice service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { practiceMock } from '@/mocks/practice.mock';
import type { PracticeContract } from './practice.contract';

/**
 * Fetches exercises and submits answers.
 *
 * @remarks
 * Points to the simulated implementation until the backend integration is built.
 */
export const practiceService: PracticeContract = practiceMock;
