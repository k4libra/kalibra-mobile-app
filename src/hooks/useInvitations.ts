/**
 * Hooks of the invitations and enrollment screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { invitationsService } from '@/services/invitations.service';
import type { StudentInvitation } from '@/types/invitation';
import { useResource } from './useResource';

/**
 * Loads the invitations of the student and exposes the accept and reject actions.
 *
 * @returns The `pending` and `expired` invitations, `accept` (resolves with the invitation or `null`),
 * `reject` (resolves with `true` on success), the `isLoading`, `isSubmitting` and `error` state.
 *
 * @example
 * ```tsx
 * const { pending, expired, accept, reject } = useInvitations();
 * ```
 */
export function useInvitations() {
  const { data, isLoading, error, refetch } = useResource(invitationsService.listInvitations, 'invitations');
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const run = useCallback(async <T,>(action: () => Promise<T>): Promise<T | null> => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      return await action();
    } catch (reason: unknown) {
      setActionError(reason instanceof Error ? reason.message : 'No se pudo responder la invitación.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const accept = useCallback((invitationId: string) => run(() => invitationsService.acceptInvitation(invitationId)), [run]);

  const reject = useCallback(
    async (invitationId: string) => {
      const done = await run(() => invitationsService.rejectInvitation(invitationId).then(() => true));
      // The simulated service keeps its data; hide the answered invitation until the real API removes it.
      if (done) setRejectedIds(ids => [...ids, invitationId]);
      return Boolean(done);
    },
    [run],
  );

  const invitations: StudentInvitation[] = (data ?? []).filter(invitation => !rejectedIds.includes(invitation.id));
  return {
    pending: invitations.filter(invitation => invitation.status === 'pending'),
    expired: invitations.filter(invitation => invitation.status === 'expired'),
    accept,
    reject,
    isLoading,
    isSubmitting,
    error: error ?? actionError,
    refetch,
  };
}

/**
 * Loads the invitation the student just accepted.
 *
 * @param invitationId - Accepted invitation.
 * @returns The `invitation` (`null` while loading), the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { invitation } = useAcceptedInvitation(invitationId);
 * ```
 */
export function useAcceptedInvitation(invitationId: string) {
  const { data, isLoading, error } = useResource(() => invitationsService.getInvitation(invitationId), `invitation-${invitationId}`);
  return { invitation: data, isLoading, error };
}
