/**
 * Pure validation and error normalization for authentication.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AuthError, AuthErrorCode, AuthFieldErrors, SignUpData } from '@/types/auth';
/** Spanish messages shared by validation and simulated endpoints. */
export const AUTH_MESSAGES: Record<AuthErrorCode, string> = {
  INVALID_EMAIL: 'Ingresa un correo institucional válido (@universidad.edu)',
  EMAIL_ALREADY_REGISTERED: 'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.',
  INVALID_CREDENTIALS: 'Verifica tu correo o contraseña e inténtalo nuevamente. Recuerda usar tu cuenta institucional.',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres y usar letras y números.',
  REQUIRED_FIELD: 'Este campo es obligatorio.',
  UNAUTHORIZED: 'Tu sesión no está disponible. Inicia sesión nuevamente.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Inténtalo nuevamente.',
};
/**
 * Recognizes institutional education domains.
 * @param email - Address entered by the student.
 * @returns Whether the normalized address belongs to an education domain.
 * @example
 * ```ts
 * isInstitutionalEmail('student@campus.edu.pe'); // true
 * ```
 */
export function isInstitutionalEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.edu(?:\.[a-z]{2,})?$/i.test(email.trim());
}
/**
 * Validates a registration without mutating the input.
 * @param input - Name, email and password entered in the form.
 * @returns Inline errors for invalid fields; an empty object when valid.
 * @example
 * ```ts
 * validateRegistration({ fullName: '', email: '', password: '' }); // required field errors
 * ```
 */
export function validateRegistration(input: SignUpData): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (!input.fullName.trim()) errors.fullName = 'Ingresa tu nombre completo.';
  if (!isInstitutionalEmail(input.email)) errors.email = AUTH_MESSAGES.INVALID_EMAIL;
  if (input.password.length < 8 || !/[a-z]/i.test(input.password) || !/\d/.test(input.password)) errors.password = AUTH_MESSAGES.INVALID_PASSWORD;
  return errors;
}
/**
 * Maps an unknown failure to the authentication UI contract.
 * @param reason - Value rejected by an authentication request.
 * @returns A recognized code and a safe user-facing message.
 * @example
 * ```ts
 * normalizeAuthError(null); // UNKNOWN_ERROR with a generic message
 * ```
 */
export function normalizeAuthError(reason: unknown): AuthError {
  if (reason instanceof Error && 'code' in reason && typeof reason.code === 'string' && reason.code in AUTH_MESSAGES) {
    const code = reason.code as AuthErrorCode;
    return { code, message: AUTH_MESSAGES[code] };
  }
  return { code: 'UNKNOWN_ERROR', message: AUTH_MESSAGES.UNKNOWN_ERROR };
}
