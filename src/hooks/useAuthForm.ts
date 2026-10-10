/**
 * Registration and sign-in form state with independent notice visibility.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useResource } from '@/hooks/useResource';
import { authService } from '@/services/auth.service';
import type { AuthFieldErrors } from '@/types/auth';
import { AUTH_MESSAGES, validateRegistration } from '@/utils/auth';
/**
 * Owns authentication fields, validation and recovery actions.
 * @param mode - Whether this form registers or authenticates an account.
 * @returns Fields, setters, `fieldErrors`, `notice`, `isDuplicate`, `isSubmitting`, `submit`, `dismissNotice` and `useAnotherEmail`.
 *
 * @example
 * ```tsx
 * const form = useAuthForm('signIn');
 * ```
 */
export function useAuthForm(mode: 'signIn' | 'signUp') {
  const auth = useAuth();
  const { data: preview } = useResource(authService.getStudyPreview, 'public-study-preview');
  const { clearError } = auth;
  const [fullName, setFullName] = useState('');
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [isNoticeVisible, setNoticeVisible] = useState(false);
  const setEmail = useCallback((value: string) => { updateEmail(value); setFieldErrors(previous => ({ ...previous, email: undefined })); clearError(); setNoticeVisible(false); }, [clearError]);
  const setPassword = useCallback((value: string) => { updatePassword(value); setFieldErrors(previous => ({ ...previous, password: undefined })); }, []);
  const dismissNotice = useCallback(() => setNoticeVisible(false), []);
  const useAnotherEmail = useCallback(() => setEmail(''), [setEmail]);
  const submit = useCallback(async () => {
    if (auth.isSubmitting) return;
    clearError();
    if (mode === 'signUp') {
      const errors = validateRegistration({ fullName, email, password });
      setFieldErrors(errors);
      if (Object.keys(errors).length) return;
      await auth.signUp({ fullName, email, password });
    } else {
      if (!email.trim() || !password) {
        setFieldErrors({ email: !email.trim() ? AUTH_MESSAGES.REQUIRED_FIELD : undefined, password: !password ? AUTH_MESSAGES.REQUIRED_FIELD : undefined });
        return;
      }
      const result = await auth.signIn({ email, password, rememberDevice });
      if (!result) { setFieldErrors({ email: 'Revisa este dato' }); setNoticeVisible(true); }
    }
  }, [auth, clearError, mode, fullName, email, password, rememberDevice]);
  return { preview, fullName, setFullName, email, setEmail, password, setPassword, rememberDevice, setRememberDevice, fieldErrors,
    isDuplicate: auth.error?.code === 'EMAIL_ALREADY_REGISTERED',
    emailError: auth.error?.code === 'EMAIL_ALREADY_REGISTERED' ? auth.error.message : fieldErrors.email,
    notice: isNoticeVisible ? auth.error?.message : null, error: auth.error,
    isSubmitting: auth.isSubmitting, submit, dismissNotice, useAnotherEmail };
}
