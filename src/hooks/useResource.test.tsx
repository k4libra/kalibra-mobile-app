/**
 * Tests for the generic read hook and the current student hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useCurrentStudent } from './useCurrentStudent';
import { useResource, type ResourceState } from './useResource';

function renderHook<T>(hook: () => T): { current: () => T } {
  let value: T;
  function Probe() {
    value = hook();
    return null;
  }
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Probe />);
  });
  return { current: () => value };
}

const flush = () => ReactTestRenderer.act(() => new Promise<void>(resolve => setTimeout(resolve, 200)));

describe('useResource', () => {
  it('exposes the loaded data', async () => {
    const result = renderHook<ResourceState<string[]>>(() => useResource(() => Promise.resolve(['a']), 'list'));
    expect(result.current().isLoading).toBe(true);
    await flush();
    expect(result.current().data).toEqual(['a']);
  });

  it('exposes the error message of a failed request', async () => {
    const result = renderHook<ResourceState<string>>(() => useResource(() => Promise.reject(new Error('boom')), 'fail'));
    await flush();
    expect(result.current().error).toBe('boom');
  });
});

describe('useCurrentStudent', () => {
  it('exposes the signed-in student', async () => {
    const result = renderHook(() => useCurrentStudent());
    await flush();
    expect(result.current().student?.firstName).toBeTruthy();
  });
});
