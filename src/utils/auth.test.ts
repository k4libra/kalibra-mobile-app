/**
 * Tests for institutional registration validation and safe error normalization.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { isInstitutionalEmail, normalizeAuthError, validateRegistration } from './auth';
test.each(['student@campus.edu', ' STUDENT@CAMPUS.EDU.PE '])('accepts institutional email %s', email => { expect(isInstitutionalEmail(email)).toBe(true); });
test.each(['a@gmail.com', 'a@campus.edu.fake.example', 'a@.edu', 'a b@campus.edu'])('rejects non-institutional email %s', email => { expect(isInstitutionalEmail(email)).toBe(false); });
test('returns field-specific feedback and accepts a valid registration', () => {
  expect(validateRegistration({ fullName: '', email: 'bad', password: 'abcdefgh' })).toHaveProperty('password');
  expect(validateRegistration({ fullName: 'Student', email: 's@campus.edu', password: 'Example2025!' })).toEqual({});
});
test('normalizes recognized failures without exposing unknown error details', () => {
  expect(normalizeAuthError(Object.assign(new Error('private details'), { code: 'INVALID_CREDENTIALS' })).code).toBe('INVALID_CREDENTIALS');
  expect(normalizeAuthError(new Error('private details')).message).not.toContain('private details');
});
