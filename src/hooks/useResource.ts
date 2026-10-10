/**
 * Generic read hook shared by the data hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useContext, useEffect, useState } from 'react';
import { NavigationContext } from '@react-navigation/native';
import type { AuthErrorCode } from '@/types/auth';
import { normalizeAuthError } from '@/utils/auth';
import { AuthContext } from '@/context/AuthContext';

/**
 * State exposed by {@link useResource}.
 *
 * @typeParam T - Shape of the loaded data.
 */
export interface ResourceState<T> {
  /** Loaded data; `null` until the first response arrives. */
  data: T | null;
  /** Whether a request is in flight. */
  isLoading: boolean;
  /** Message of the last failure; `null` when the last request succeeded. */
  error: string | null;
  /** Typed domain reason; null until a request fails. */
  errorCode: AuthErrorCode | null;
  /** Repeats the request. */
  refetch: () => void;
}

/**
 * Runs an asynchronous loader and exposes its result, loading and error state.
 *
 * @remarks
 * The loader runs again whenever `key` changes. Responses that arrive after unmounting or after a
 * newer request are ignored. Account changes invalidate every read and hide previous account data.
 *
 * @typeParam T - Shape of the loaded data.
 * @param loader - Function that returns the data; usually a service method.
 * @param key - Serializable value that identifies the request, for example the course id.
 * @param refreshOnFocus - Whether returning to a read-only screen refreshes its data.
 * @returns The `data`, the `isLoading` and `error` state, and `refetch` to reload.
 *
 * @example
 * ```ts
 * const { data, isLoading } = useResource(() => coursesService.listSubtopics(courseId), courseId);
 * ```
 */
export function useResource<T>(loader: () => Promise<T>, key: string, refreshOnFocus = false): ResourceState<T> {
  const navigation = useContext(NavigationContext);
  const [version, setVersion] = useState(0);
  const session = useContext(AuthContext)?.session;
  const accountKey = session?.user.id ?? 'signed-out';
  const requestKey = `${accountKey}:${key}#${version}`;
  const [result, setResult] = useState<{ requestKey: string | null; data: T | null; error: string | null; errorCode: AuthErrorCode | null }>({
    requestKey: null,
    data: null,
    error: null,
    errorCode: null,
  });

  useEffect(() => {
    let isCurrent = true;
    loader()
      .then(data => {
        if (isCurrent) setResult({ requestKey, data, error: null, errorCode: null });
      })
      .catch((reason: unknown) => {
        const error = reason instanceof Error ? reason.message : 'No se pudo cargar la información.';
        if (isCurrent) setResult(previous => ({ requestKey, data: previous.requestKey === requestKey ? previous.data : null, error, errorCode: normalizeAuthError(reason).code }));
      });
    return () => {
      isCurrent = false;
    };
    // The loader is recreated on every render; `requestKey` identifies the request instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const refetch = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    if (refreshOnFocus) return navigation?.addListener('focus', refetch);
    return undefined;
  }, [navigation, refreshOnFocus, refetch]);
  const isLoading = result.requestKey !== requestKey;
  return { data: isLoading ? null : result.data, isLoading, error: isLoading ? null : result.error, errorCode: isLoading ? null : result.errorCode, refetch };
}
