/**
 * Contract of the student invitations endpoints, shared by the real and the simulated service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { StudentInvitation } from '@/types/invitation';

/**
 * Operations the student app needs to answer course invitations.
 */
export interface InvitationsContract {
  /** Lists the pending and expired invitations of the student. */
  listInvitations: () => Promise<StudentInvitation[]>;
  /** Fetches one invitation; rejects when it does not exist. */
  getInvitation: (invitationId: string) => Promise<StudentInvitation>;
  /** Accepts a pending invitation and enrolls the student in its course. */
  acceptInvitation: (invitationId: string) => Promise<StudentInvitation>;
  /** Rejects a pending invitation; the teacher can send it again. */
  rejectInvitation: (invitationId: string) => Promise<void>;
}
