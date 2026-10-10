/**
 * Percentage helper for summaries.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Calculates a rounded percentage.
 *
 * @param part - Amount counted, for example right answers.
 * @param total - Reference amount, for example submitted answers.
 * @returns The rounded percentage from 0 to 100, or `null` when `total` is 0.
 *
 * @example
 * ```ts
 * percent(31, 42); // 74
 * ```
 */
export function percent(part: number, total: number): number | null {
  return total === 0 ? null : Math.round((part / total) * 100);
}
