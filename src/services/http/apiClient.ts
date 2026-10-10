/**
 * Provides cookie-authenticated JSON transport and safe Spanish API errors.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { API_BASE_URL } from '@/config/api';
import type { AuthErrorCode } from '@/types/auth';
import { AUTH_MESSAGES } from '@/utils/auth';
import { getSessionRevision, setSession } from '@/services/http/session';
/** Describes optional JSON data and request cancellation. */
export interface RequestOptions {
  /** Data serialized as JSON when provided. */
  body?: unknown;
  /** Signal that cancels the native request. */
  signal?: AbortSignal;
  /** Whether a 401 is expected during authentication or startup restoration. */
  auth?: boolean;
}
/** Represents an HTTP or networking failure without exposing server details in the UI. */
export class ApiError extends Error {
  /** HTTP status, or zero for transport failures. */
  readonly status: number;
  /** Recognized reason shared with authentication normalization. */
  readonly code: AuthErrorCode;
  /** Parsed ProblemDetail, retained for callers without displaying its detail. */
  readonly body: unknown;
  /** Creates an error with a safe message and optional response data. */
  constructor(status: number, code: AuthErrorCode, body?: unknown) {
    super(AUTH_MESSAGES[code]);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}
function errorCode(status: number, path: string): AuthErrorCode {
  if (status === 401)
    return path === '/authentication/sign-in'
      ? 'INVALID_CREDENTIALS'
      : 'UNAUTHORIZED';
  if (status === 403)
    return path === '/authentication/sign-in'
      ? 'MOBILE_ACCESS_DENIED'
      : 'FORBIDDEN';
  if (status === 404)
    return path === '/practice-exercises' ? 'NO_EXERCISES' : 'NOT_FOUND';
  if (status === 409)
    return path === '/authentication/sign-up'
      ? 'EMAIL_ALREADY_REGISTERED'
      : 'CONFLICT';
  if (status === 503) return 'SERVICE_UNAVAILABLE';
  return 'UNKNOWN_ERROR';
}
/**
 * Sends a cookie-authenticated JSON request.
 * @typeParam T - Expected successful response body.
 * @param method - HTTP verb.
 * @param path - Resource path relative to the API base URL.
 * @param options - JSON payload, abort signal and authentication scope.
 * @returns The parsed response, or undefined for a 204 response.
 * @throws ApiError on a failed status, invalid JSON or unavailable network.
 */
async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const revision = getSessionRevision();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
      signal: options.signal,
    });
  } catch (reason: unknown) {
    if (reason instanceof Error && reason.name === 'AbortError') throw reason;
    throw new ApiError(0, 'NETWORK_ERROR');
  }
  if (!response.ok) {
    if (
      response.status === 401 &&
      !options.auth &&
      revision === getSessionRevision()
    )
      setSession(null);
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(response.status, errorCode(response.status, path), body);
  }
  if (response.status === 204) return undefined as T;
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(response.status, 'UNKNOWN_ERROR');
  }
}
/** Provides the shared typed HTTP boundary used by every service. */
export const apiClient = {
  /** Reads a resource; rejects with ApiError on failure. */
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, options),
  /** Creates a resource with JSON data; rejects with ApiError on failure. */
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  /** Replaces a resource with JSON data; rejects with ApiError on failure. */
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
};
