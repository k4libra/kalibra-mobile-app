/**
 * Provides generic, typed HTTP fixtures exclusively for automated tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type {
  AttemptDto,
  CourseDto,
  PendingInvitationDto,
  PreferencesDto,
  ProgressDto,
  UserDto,
} from '@/types/api';
import type { AuthUser } from '@/types/auth';
/** Generic student account documented in API contract v2. */
export const TEST_CREDENTIALS = {
  email: 'estudiante.test1@upc.edu.pe',
  password: '@estudiantetest1',
  rememberDevice: false,
};
/** Public generic student identity. */
export const TEST_USER_DTO: UserDto = {
  id: 'student-1',
  email: TEST_CREDENTIALS.email,
  firstName: 'Estudiante',
  lastName: 'Test Uno',
  roles: ['REGISTERED_USER', 'STUDENT'],
};
/** Domain identity used by service-independent hook tests. */
export const TEST_USER: AuthUser = {
  id: TEST_USER_DTO.id,
  email: TEST_USER_DTO.email,
  fullName: 'Estudiante Test Uno',
  role: 'student',
  faculty: '',
  semester: '',
};
/** Enrolled curriculum without fabricated faculty or semester fields. */
export const TEST_COURSES: CourseDto[] = [
  {
    courseId: 'course-1',
    name: 'Algoritmos',
    code: 'CS-01',
    teacherName: 'Profesor Test Uno',
    enrolledAt: '2026-10-01T12:00:00Z',
    subtopics: [
      { id: 'sub-1', name: 'Recursividad y Backtracking', displayOrder: 1 },
      { id: 'sub-2', name: 'Árboles Binarios de Búsqueda', displayOrder: 2 },
      { id: 'sub-3', name: 'Programación Dinámica', displayOrder: 3 },
      { id: 'sub-4', name: 'Grafos', displayOrder: 4 },
    ],
  },
  {
    courseId: 'course-2',
    name: 'Álgebra Lineal',
    code: 'MA-02',
    teacherName: 'Profesor Test Dos',
    enrolledAt: '2026-10-01T12:00:00Z',
    subtopics: [{ id: 'sub-5', name: 'Espacios Vectoriales', displayOrder: 1 }],
  },
  {
    courseId: 'course-3',
    name: 'Cálculo',
    code: 'MA-03',
    teacherName: 'Profesor Test Uno',
    enrolledAt: '2026-10-01T12:00:00Z',
    subtopics: [{ id: 'sub-6', name: 'Derivadas', displayOrder: 1 }],
  },
];
/** Progress with exact percentages and an explicit no-activity course. */
export const TEST_PROGRESS: ProgressDto[] = TEST_COURSES.map(
  (course, index) => ({
    studentId: TEST_USER.id,
    courseId: course.courseId,
    hasActivity: index < 2,
    recentFeedback: [],
    subtopics: course.subtopics.map((subtopic, position) => ({
      subtopicId: subtopic.id,
      subtopicName: subtopic.name,
      mastery:
        index === 0 ? [81, 72, 33, null][position] : index === 1 ? 80 : null,
      level:
        index === 2 || position === 3
          ? 'NO_DATA'
          : position === 2
          ? 'LOW'
          : 'HIGH',
      solvedCount: index === 0 && position < 3 ? 1 : 0,
    })),
  }),
);
/** Recorded answers shared by history and result recovery. */
export const TEST_ATTEMPTS: AttemptDto[] = [
  {
    id: 'attempt-1',
    subtopicId: 'sub-1',
    statement: 'Evaluación de función recursiva misterio(n)',
    result: 'CORRECT',
    explanation: 'Se suman 5, 3 y 1: el resultado es 9.',
    previousMastery: 72,
    currentMastery: 81,
    masteryDeltaPoints: 9,
    masteryChanged: true,
    answeredAt: '2026-10-10T15:45:00Z',
  },
  {
    id: 'attempt-2',
    subtopicId: 'sub-3',
    statement: 'Matriz de subsecuencia común más larga (LCS)',
    result: 'INCORRECT',
    explanation: 'Compara los prefijos antes de completar la matriz.',
    previousMastery: 35,
    currentMastery: 33,
    masteryDeltaPoints: -2,
    masteryChanged: true,
    answeredAt: '2026-10-09T15:45:00Z',
  },
  {
    id: 'attempt-3',
    subtopicId: 'sub-2',
    statement: 'Rotación simple a la derecha en árbol AVL',
    result: 'CORRECT',
    explanation: 'La rotación conserva el orden del árbol.',
    previousMastery: 70,
    currentMastery: 72,
    masteryDeltaPoints: 2,
    masteryChanged: true,
    answeredAt: '2026-10-08T15:45:00Z',
  },
];
/** Pending invitation to a course not initially enrolled. */
export const TEST_INVITATION: PendingInvitationDto = {
  id: 'inv-1',
  courseName: 'Estadística',
  teacherEmail: 'profesor.test1@upc.edu.pe',
  sentAt: '2026-10-01T12:00:00Z',
  expiresAt: '2099-10-12T12:00:00Z',
};
/** Default stored preferences with no previously configured reminder time. */
export const TEST_PREFERENCES: PreferencesDto = {
  dailyReminderEnabled: true,
  dailyReminderTime: null,
  darkMode: false,
};
