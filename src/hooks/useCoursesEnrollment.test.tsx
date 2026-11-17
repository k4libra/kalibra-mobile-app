/**
 * Tests for the courses, course subtopics and invitations hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { invitationsService } from '@/services/invitations.service';
import { authService } from '@/services/auth.service';
import { TEST_COURSES, TEST_CREDENTIALS, TEST_INVITATION, TEST_PROGRESS } from '@/test/apiFixtures';
import { jsonResponse, resetApiStub } from '@/test/fetchStub';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useCourseSubtopics } from './useCourseSubtopics';
import { useAcceptedInvitation, useInvitations } from './useInvitations';
import { useMyCourses } from './useMyCourses';

jest.useFakeTimers();
const mounted: ReactTestRenderer.ReactTestRenderer[] = [];
afterEach(async () => {
  await ReactTestRenderer.act(async () => { mounted.splice(0).forEach(tree => tree.unmount()); });
  jest.clearAllTimers();
});

async function renderHook<T>(hook: () => T): Promise<() => T> {
  let value: T;
  function Probe() {
    value = hook();
    return null;
  }
  ReactTestRenderer.act(() => {
    mounted.push(ReactTestRenderer.create(<Probe />));
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  return () => value;
}


beforeEach(async () => {
  resetApiStub();
  const request = authService.signIn(TEST_CREDENTIALS);
  jest.runAllTimers();
  await request;
});

describe('useMyCourses', () => {
  it('exposes the student and the enrolled courses', async () => {
    const result = await renderHook(() => useMyCourses());
    expect(result().student).not.toBeNull();
    expect(result().courses.length).toBeGreaterThan(0);
  });

  it('refreshes pending invitation counts together with enrolled courses', async () => {
    const fetchSpy = jest.mocked(globalThis.fetch);
    const original = fetchSpy.getMockImplementation()!;
    let pending = [TEST_INVITATION];
    fetchSpy.mockImplementation((url, init) => String(url).endsWith('/invitations?status=PENDING')
      ? Promise.resolve(jsonResponse(pending))
      : original(url, init));
    const result = await renderHook(() => useMyCourses());
    expect(result().student?.pendingInvitationCount).toBe(1);
    const enrolledIds = result().courses.map(course => course.id);

    pending = [TEST_INVITATION, { ...TEST_INVITATION, id: 'new-invitation' }, { ...TEST_INVITATION, id: 'expired', expiresAt: '2000-01-01T00:00:00Z' }];
    fetchSpy.mockClear();
    await ReactTestRenderer.act(async () => { result().refetch(); });
    expect(result().student?.pendingInvitationCount).toBe(2);
    expect(result().courses.map(course => course.id)).toEqual(enrolledIds);
    expect(result().isLoading).toBe(false);
    expect(fetchSpy.mock.calls.some(([url]) => String(url).endsWith('/invitations?status=PENDING'))).toBe(true);
    expect(fetchSpy.mock.calls.some(([url]) => String(url).endsWith('/students/me/courses'))).toBe(true);

    pending = [];
    await ReactTestRenderer.act(async () => { result().refetch(); });
    expect(result().student?.pendingInvitationCount).toBe(0);
    expect(result().courses.map(course => course.id)).toEqual(enrolledIds);
  });

  it('offers express practice for the practiced course needing the most reinforcement', async () => {
    const fetchSpy = jest.mocked(globalThis.fetch);
    const original = fetchSpy.getMockImplementation()!;
    const progress = {
      ...TEST_PROGRESS[0],
      subtopics: TEST_PROGRESS[0].subtopics.map(item => item.mastery === null ? { ...item, mastery: 60 } : item),
    };
    fetchSpy.mockImplementation((url, init) => String(url).endsWith('/students/me/courses')
      ? Promise.resolve(jsonResponse([TEST_COURSES[1], TEST_COURSES[2], TEST_COURSES[0]]))
      : String(url).endsWith('/courses/course-1/student-progress')
        ? Promise.resolve(jsonResponse(progress))
        : original(url, init));
    const result = await renderHook(() => useMyCourses());
    expect(result().featuredCourse?.id).toBe('course-1');
    expect(result().quickPractice).toEqual({ courseId: 'course-1', mode: 'EXPRESS' });
    expect(result().featuredCourse?.mastery).toBe(62);
  });

  it('preserves missing mastery instead of inventing a zero for unpracticed courses', async () => {
    const fetchSpy = jest.mocked(globalThis.fetch);
    const original = fetchSpy.getMockImplementation()!;
    fetchSpy.mockImplementation((url, init) => String(url).endsWith('/student-progress')
      ? Promise.resolve(jsonResponse({ hasActivity: false, subtopics: [], recentFeedback: [] }))
      : original(url, init));
    const result = await renderHook(() => useMyCourses());
    expect(result().courses).toHaveLength(TEST_COURSES.length);
    expect(result().courses.every(course => course.mastery === null)).toBe(true);
    expect(result().student?.averageMastery).toBeNull();
    expect(result().featuredCourse?.mastery).toBeNull();
    expect(result().quickPractice).toEqual({ courseId: 'course-1', mode: 'EXPRESS' });
  });
});

describe('useCourseSubtopics', () => {
  it('exposes the course and its subtopics', async () => {
    const result = await renderHook(() => useCourseSubtopics('course-1'));
    expect(result().course?.id).toBe('course-1');
    expect(result().subtopics.length).toBeGreaterThan(0);
  });
});

describe('useInvitations', () => {
  it('splits pending and expired invitations', async () => {
    const result = await renderHook(() => useInvitations());
    expect(result().pending.every(invitation => invitation.status === 'pending')).toBe(true);
    expect(result().expired.every(invitation => invitation.status === 'expired')).toBe(true);
  });

  it('loads an accepted invitation', async () => {
    await invitationsService.acceptInvitation('inv-1');
    const result = await renderHook(() => useAcceptedInvitation('inv-1'));
    expect(result().invitation?.id).toBe('inv-1');
  });
});
