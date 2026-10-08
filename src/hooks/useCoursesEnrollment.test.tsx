/**
 * Tests for the courses, course subtopics and invitations hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useCourseSubtopics } from './useCourseSubtopics';
import { useAcceptedInvitation, useInvitations } from './useInvitations';
import { useMyCourses } from './useMyCourses';

jest.useFakeTimers();

async function renderHook<T>(hook: () => T): Promise<() => T> {
  let value: T;
  function Probe() {
    value = hook();
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Probe />);
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  return () => value;
}

describe('useMyCourses', () => {
  it('exposes the student and the enrolled courses', async () => {
    const result = await renderHook(() => useMyCourses());
    expect(result().student).not.toBeNull();
    expect(result().courses.length).toBeGreaterThan(0);
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
    const result = await renderHook(() => useAcceptedInvitation('inv-1'));
    expect(result().invitation?.id).toBe('inv-1');
  });
});
