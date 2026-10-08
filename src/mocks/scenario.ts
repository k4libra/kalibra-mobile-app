/**
 * Selects which fixture set the simulated services return.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Fixture sets available: `default` shows the sample data and `empty` shows the empty states.
 */
export type MockScenario = 'default' | 'empty';

/**
 * Fixture set in use; change it to `'empty'` to review the empty states.
 */
export const MOCK_SCENARIO: MockScenario = 'default';

/**
 * Whether the empty scenario is active.
 *
 * @returns `true` when {@link MOCK_SCENARIO} is `empty`.
 *
 * @example
 * ```ts
 * const courses = isEmptyScenario() ? [] : COURSES;
 * ```
 */
export function isEmptyScenario(): boolean {
  return (MOCK_SCENARIO as MockScenario) === 'empty';
}

/**
 * Resolves a value after a short delay to imitate a network round trip.
 *
 * @typeParam T - Shape of the simulated response.
 * @param data - Response returned by the simulated endpoint.
 * @returns A promise that resolves with `data` after 150 ms.
 *
 * @example
 * ```ts
 * listCourses: () => respond(COURSES)
 * ```
 */
export function respond<T>(data: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), 150));
}
