/**
 * Tests for the student invitations service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { invitationsService } from './invitations.service';

describe('invitationsService', () => {
  it('lists pending and expired invitations', async () => {
    const statuses = (await invitationsService.listInvitations()).map(invitation => invitation.status);
    expect(statuses).toEqual(expect.arrayContaining(['pending', 'expired']));
  });

  it('accepts a pending invitation', async () => {
    expect((await invitationsService.acceptInvitation('inv-1')).courseId).toBeTruthy();
  });

  it('rejects an unknown invitation', async () => {
    await expect(invitationsService.getInvitation('missing')).rejects.toThrow();
  });
});
