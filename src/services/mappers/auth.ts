/**
 * Maps cookie-session identity and preferences to UI models.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PreferencesDto, UserDto } from '@/types/api';
import type { AuthSession, ProfilePreferences } from '@/types/auth';
/**
 * Maps public identity without creating or storing a token.
 *
 * @param dto - Public account identity from authentication or restoration.
 * @returns The UI session containing identity only.
 *
 * @example
 * ```ts
 * mapSession(userDto).user.fullName;
 * ```
 */
export function mapSession(dto: UserDto): AuthSession {
  return {
    user: {
      id: dto.id,
      fullName:
        [dto.firstName, dto.lastName].filter(Boolean).join(' ') || dto.email,
      email: dto.email,
      role: 'student',
      faculty: '',
      semester: '',
    },
  };
}
/**
 * Maps stored preferences while leaving reminder time in the API layer.
 *
 * @param dto - Persisted settings including the server reminder time.
 * @returns The two preferences exposed by the current UI.
 *
 * @example
 * ```ts
 * mapPreferences(preferencesDto).dailyReminders;
 * ```
 */
export function mapPreferences(dto: PreferencesDto): ProfilePreferences {
  return { darkMode: dto.darkMode, dailyReminders: dto.dailyReminderEnabled };
}
