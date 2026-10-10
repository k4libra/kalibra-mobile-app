/**
 * Stubs the HTTP boundary with independent generic accounts for integration tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { API_BASE_URL } from '@/config/api';
import { setSession } from '@/services/http/session';
import type {
  AttemptDto,
  CourseDto,
  HistoryDto,
  PreferencesDto,
  UserDto,
} from '@/types/api';
import {
  TEST_ATTEMPTS,
  TEST_COURSES,
  TEST_CREDENTIALS,
  TEST_INVITATION,
  TEST_PREFERENCES,
  TEST_PROGRESS,
  TEST_USER_DTO,
} from '@/test/apiFixtures';
interface Account {
  user: UserDto;
  password: string;
  preferences: PreferencesDto;
  courses: CourseDto[];
  attempts: AttemptDto[];
}
/** Creates a minimal fetch response that exercises JSON and no-content behavior. */
export function jsonResponse(body: unknown, status = 200): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as Response;
}
/** Installs a fresh API stub; returns the fetch spy for request assertions and overrides. */
export function resetApiStub() {
  setSession(null);
  const accounts = new Map<string, Account>();
  const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
  accounts.set(TEST_CREDENTIALS.email, {
    user: clone(TEST_USER_DTO),
    password: TEST_CREDENTIALS.password,
    preferences: clone(TEST_PREFERENCES),
    courses: clone(TEST_COURSES),
    attempts: clone(TEST_ATTEMPTS),
  });
  let current: Account | null = null;
  let pending = true;
  let submitted = 0;
  return jest
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (input, init) => {
      const url = String(input);
      const path = url.replace(API_BASE_URL, '');
      const method = init?.method ?? 'GET';
      const body = init?.body
        ? (JSON.parse(String(init.body)) as Record<string, unknown>)
        : {};
      const problem = (status: number) =>
        jsonResponse(
          { title: 'Test failure', status, detail: 'Server-only detail' },
          status,
        );
      if (method === 'POST' && path === '/authentication/sign-up') {
        const email = String(body.email);
        if (accounts.has(email)) return problem(409);
        const user: UserDto = {
          id: `student-${accounts.size + 1}`,
          email,
          firstName: String(body.firstName),
          lastName: String(body.lastName),
          roles: ['STUDENT'],
        };
        accounts.set(email, {
          user,
          password: String(body.password),
          preferences: clone(TEST_PREFERENCES),
          courses: [],
          attempts: [],
        });
        return jsonResponse(user, 201);
      }
      if (method === 'POST' && path === '/authentication/sign-in') {
        const account = accounts.get(String(body.email));
        if (!account || account.password !== body.password) return problem(401);
        current = account;
        return jsonResponse(account.user);
      }
      if (method === 'POST' && path === '/authentication/sign-out') {
        current = null;
        return jsonResponse(undefined, 204);
      }
      if (!current) return problem(401);
      if (path === '/users/me') return jsonResponse(current.user);
      if (path === '/students/me/courses') return jsonResponse(current.courses);
      if (path === '/student-preferences/me')
        return jsonResponse(current.preferences);
      if (method === 'PUT' && path === '/student-preferences/me/dark-mode') {
        current.preferences.darkMode = body.enabled === true;
        return jsonResponse(current.preferences);
      }
      if (
        method === 'PUT' &&
        path === '/student-preferences/me/daily-reminder'
      ) {
        current.preferences.dailyReminderEnabled = body.enabled === true;
        current.preferences.dailyReminderTime =
          typeof body.time === 'string' ? body.time : null;
        return jsonResponse(current.preferences);
      }
      if (path === '/invitations?status=PENDING')
        return jsonResponse(
          current.user.id === TEST_USER_DTO.id && pending
            ? [TEST_INVITATION]
            : [],
        );
      if (
        method === 'POST' &&
        /^\/invitations\/inv-1\/(acceptances|rejections)$/.test(path)
      ) {
        if (!pending) return problem(409);
        pending = false;
        if (path.endsWith('/acceptances'))
          current.courses.push({
            ...clone(TEST_COURSES[2]),
            courseId: 'course-4',
            name: TEST_INVITATION.courseName,
          });
        return jsonResponse(
          {
            id: 'inv-1',
            courseId: 'course-4',
            invitedEmail: current.user.email,
            status: path.endsWith('/acceptances') ? 'ACCEPTED' : 'REJECTED',
            sentAt: TEST_INVITATION.sentAt,
            expiresAt: TEST_INVITATION.expiresAt,
          },
          201,
        );
      }
      const progressMatch = path.match(
        /^\/courses\/([^/]+)\/student-progress$/,
      );
      if (progressMatch) {
        const progress = TEST_PROGRESS.find(
          item => item.courseId === progressMatch[1],
        );
        const course = current.courses.find(
          item => item.courseId === progressMatch[1],
        );
        if (!course) return problem(404);
        return jsonResponse(
          progress ?? {
            studentId: current.user.id,
            courseId: course.courseId,
            hasActivity: false,
            subtopics: [],
            recentFeedback: [],
          },
        );
      }
      if (path.startsWith('/subtopic-masteries?courseId=')) {
        const progress = TEST_PROGRESS.find(
          item => item.courseId === path.split('=')[1],
        );
        return jsonResponse(
          progress?.subtopics.map(item => ({
            subtopicId: item.subtopicId,
            name: item.subtopicName,
            level: item.level,
          })) ?? [],
        );
      }
      if (method === 'POST' && path === '/practice-exercises') {
        if (
          !current.courses.some(
            course =>
              course.courseId === body.courseId &&
              course.subtopics.some(item => item.id === body.subtopicId),
          )
        )
          return problem(404);
        return jsonResponse(
          {
            exerciseId: `exercise-${String(body.subtopicId)}`,
            subtopicId: body.subtopicId,
            statement: 'Evalúa la suma de 5, 3 y 1.',
            options: ['9', '15', '8', 'Ninguna'],
          },
          201,
        );
      }
      if (method === 'POST' && path === '/exercise-attempts') {
        const correct = body.selectedOptionKey === 'A';
        const attempt: AttemptDto = {
          ...clone(TEST_ATTEMPTS[0]),
          id: `submitted-${++submitted}`,
          subtopicId: String(body.exerciseId).replace('exercise-', ''),
          result: correct ? 'CORRECT' : 'INCORRECT',
          masteryDeltaPoints: correct ? 9 : -2,
          currentMastery: correct ? 81 : 70,
        };
        current.attempts.unshift(attempt);
        return jsonResponse(attempt, 201);
      }
      if (path.startsWith('/exercise-attempts?')) {
        const params = new URLSearchParams(path.split('?')[1]);
        const course = current.courses.find(
          item => item.courseId === params.get('courseId'),
        );
        if (!course) return problem(404);
        const all = current.attempts.filter(item =>
          course.subtopics.some(subtopic => subtopic.id === item.subtopicId),
        );
        const result = params.get('result') ?? 'ALL';
        const filtered = all.filter(
          item => result === 'ALL' || item.result === result,
        );
        const page = Number(params.get('page')),
          size = Number(params.get('size'));
        const dto: HistoryDto = {
          allCount: all.length,
          correctCount: all.filter(item => item.result === 'CORRECT').length,
          incorrectCount: all.filter(item => item.result === 'INCORRECT')
            .length,
          activeFilter: result as HistoryDto['activeFilter'],
          content: filtered.slice(page * size, (page + 1) * size),
          page,
          size,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
        };
        return jsonResponse(dto);
      }
      throw new Error(`Unhandled test request: ${method} ${path}`);
    });
}
