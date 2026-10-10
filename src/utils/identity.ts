/**
 * Pure account-name formatting helpers.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Extracts up to two initials from a display name.
 * @param name - Account display name.
 * @returns Uppercase initials, or an empty string for a blank name.
 * @example
 * ```ts
 * initials('Student Example'); // 'SE'
 * ```
 */
export function initials(name: string): string { return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase(); }
