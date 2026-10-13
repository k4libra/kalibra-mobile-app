/**
 * Tests pure DTO mappings and the absence of fabricated UI data.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { mapSession, mapPreferences } from '@/services/mappers/auth';
import {
  averageMastery,
  mapCourse,
  mapSubtopics,
  mapProgress,
} from '@/services/mappers/courses';
import { mapExercise, mapResult } from '@/services/mappers/practice';
import { mapHistoryEntry } from '@/services/mappers/history';
import { mapInvitation } from '@/services/mappers/invitations';
import {
  TEST_USER_DTO,
  TEST_USER,
  TEST_PREFERENCES,
  TEST_COURSES,
  TEST_PROGRESS,
  TEST_ATTEMPTS,
  TEST_INVITATION,
} from '@/test/apiFixtures';
test('maps names and preferences without storing a token', () => {
  expect(mapSession(TEST_USER_DTO)).toEqual({ user: TEST_USER });
  expect(mapPreferences(TEST_PREFERENCES)).toEqual({
    dailyReminders: true,
    darkMode: false,
  });
});
test('preserves the teacher name or null without inventing a teacher identity', () => {
  expect(mapCourse(TEST_COURSES[0], TEST_PROGRESS[0]).teacherName).toBe(TEST_COURSES[0].teacherName);
  expect(mapCourse({ ...TEST_COURSES[0], teacherName: null }, TEST_PROGRESS[0]).teacherName).toBeNull();
});
test('preserves null mastery and does not scale percentages or turn levels into invented percentages', () => {
  expect(averageMastery([null, null])).toBeNull();
  expect(averageMastery([40, 70, null])).toBe(55);
  const progress = TEST_PROGRESS[0];
  const course = mapCourse(TEST_COURSES[0], progress);
  expect(course).toMatchObject({
    mastery: 62,
    masteredSubtopicCount: 2,
    solvedExerciseCount: 3,
    faculty: '',
    estimatedTimeLeft: '',
  });
  const subtopics = mapSubtopics(TEST_COURSES[0], progress, [
    { subtopicId: 'sub-4', name: 'Grafos', level: 'HIGH' },
  ]);
  expect(subtopics.map(item => item.mastery)).toEqual([81, 72, 33, null]);
});
test('uses hasActivity to preserve the initial state even if inconsistent percentages arrive', () => {
  const progress = mapProgress(TEST_COURSES[0], {
    ...TEST_PROGRESS[0],
    hasActivity: false,
  });
  expect(progress.course.mastery).toBeNull();
  expect(progress.focus).toBeNull();
  expect(progress.practicedSubtopicCount).toBe(0);
});
test('sorts curriculum without mutating the server DTO', () => {
  const course = {
    ...TEST_COURSES[0],
    subtopics: [...TEST_COURSES[0].subtopics].reverse(),
  };
  expect(mapSubtopics(course, TEST_PROGRESS[0])[0].id).toBe('sub-1');
  expect(course.subtopics[0].id).toBe('sub-4');
});
test('labels practiced subtopics with solved counts and leaves unpracticed ones explicit', () => {
  const progress = { ...TEST_PROGRESS[0], subtopics: TEST_PROGRESS[0].subtopics.map((item, index) => ({
    ...item, solvedCount: index === 2 ? 2 : item.solvedCount, mastery: index === 2 ? 28 : item.mastery,
  })) };
  const subtopics = mapSubtopics(TEST_COURSES[0], progress);
  expect(subtopics.map(item => item.note)).toEqual(['1 resuelto', '1 resuelto', '2 resueltos', 'Sin práctica']);
  expect(subtopics[2].mastery).toBe(28);
  expect(mapSubtopics(TEST_COURSES[0], { ...progress, hasActivity: false }).every(item => item.note === 'Sin práctica')).toBe(true);
});
test('uses level copy when mastery is known but no solved count is available', () => {
  const progress = { ...TEST_PROGRESS[0], subtopics: TEST_PROGRESS[0].subtopics.map(item => ({ ...item, solvedCount: 0 })) };
  expect(mapSubtopics(TEST_COURSES[0], progress)[2].note).toBe('Dominio Bajo');
});
test.each([['EASY', 1], ['MEDIUM', 2], ['HARD', 3]] as const)('maps %s adaptive difficulty to level %s', (difficulty, level) => {
  const exercise = mapExercise({ exerciseId: 'e', subtopicId: 'sub-1', statement: 'Pregunta', options: [], difficulty }, TEST_COURSES[0]);
  expect(exercise.difficultyLabel).toBe(`Dificultad adaptativa: Nivel ${level}`);
});
test('maps embedded code into ordered display blocks and hides missing difficulty', () => {
  const exercise = mapExercise({ exerciseId: 'e', subtopicId: 'sub-1', statement: 'Analiza:\n```java\nreturn 1;\n```\n¿Qué retorna?', options: [] }, TEST_COURSES[0]);
  expect(exercise.statementSegments.map(item => item.type)).toEqual(['prose', 'code', 'prose']);
  expect(exercise.difficultyLabel).toBe('');
});
test('preserves the statement and keys without adding a hint, code or session scores', () => {
  const exercise = mapExercise(
    {
      exerciseId: 'exercise-1',
      subtopicId: 'sub-1',
      statement: 'Una pregunta',
      options: ['Uno', 'Dos', 'Tres', 'Cuatro'],
    },
    TEST_COURSES[0],
  );
  expect(exercise.options.map(item => [item.id, item.letter])).toEqual([
    ['A', 'A'],
    ['B', 'B'],
    ['C', 'C'],
    ['D', 'D'],
  ]);
  expect(exercise).toMatchObject({
    prompt: [{ text: 'Una pregunta' }],
    sessionPoints: null,
    sessionSize: null,
    code: null,
    hint: '',
  });
});
test('retains negative mastery changes, attempt identity and the complete explanation', () => {
  const result = mapResult(TEST_ATTEMPTS[1], TEST_COURSES[0]);
  expect(result).toMatchObject({
    attemptId: 'attempt-2',
    courseId: 'course-1',
    subtopicId: 'sub-3',
    exerciseId: null,
    masteryDelta: -2,
    explanation: TEST_ATTEMPTS[1].explanation,
  });
  expect(
    mapResult({ ...TEST_ATTEMPTS[0], masteryChanged: false }, TEST_COURSES[0])
      .masteryDelta,
  ).toBe(0);
});
test('maps dates with an explicit clock and omits unavailable invitation metadata', () => {
  const invitation = mapInvitation(
    TEST_INVITATION,
    Date.parse('2026-10-10T12:00:00Z'),
  );
  expect(invitation).toMatchObject({
    courseId: '',
    term: '',
    courseCode: '',
    teacherName: TEST_INVITATION.teacherEmail,
    status: 'pending',
  });
  expect(
    mapInvitation(TEST_INVITATION, Date.parse('2100-01-01T00:00:00Z')).status,
  ).toBe('expired');
});
test('uses the statement as the history title and keeps result navigation on the attempt id', () => {
  expect(mapHistoryEntry(TEST_ATTEMPTS[1], TEST_COURSES[0])).toMatchObject({
    attemptId: 'attempt-2',
    title: TEST_ATTEMPTS[1].statement,
    result: 'incorrect',
    duration: null,
    isPendingReview: false,
  });
});
