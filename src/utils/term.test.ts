import { currentAcademicTerm, formatRelativeDateTime } from './term';

describe('currentAcademicTerm', () => {
  it('maps months to the two academic cycles', () => {
    expect(currentAcademicTerm(new Date(2026, 2, 10))).toBe('2026-I');
    expect(currentAcademicTerm(new Date(2026, 10, 14))).toBe('2026-II');
  });
});

describe('formatRelativeDateTime', () => {
  it('uses Hoy and Ayer before a short date', () => {
    const now = new Date(2025, 8, 12, 18, 0);
    expect(formatRelativeDateTime(new Date(2025, 8, 12, 10, 45), now)).toBe('Hoy, 10:45');
    expect(formatRelativeDateTime(new Date(2025, 8, 11, 16, 20), now)).toBe('Ayer, 16:20');
    expect(formatRelativeDateTime(new Date(2025, 8, 3, 9, 5), now)).toBe('03 sep 2025, 09:05');
  });
});
