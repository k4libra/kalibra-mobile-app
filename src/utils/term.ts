/** Fallback academic cycle when enrollment metadata has no term (I: January–July, II: August–December). */
export function currentAcademicTerm(today: Date = new Date()): string {
  return `${today.getFullYear()}-${today.getMonth() >= 7 ? 'II' : 'I'}`;
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Formats `Hoy, 10:45`, `Ayer, 16:20` or `12 sep 2025, 09:30` relative to `now`. */
export function formatRelativeDateTime(value: string | Date, now: Date = new Date()): string {
  const date = new Date(value);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const startOfDay = (day: Date) => new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);
  if (diff === 0) return `Hoy, ${time}`;
  if (diff === 1) return `Ayer, ${time}`;
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${time}`;
}

/** Formats `14 nov` for compact invitation metadata. */
export function formatShortDayMonth(value: string | Date): string {
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]}`;
}
