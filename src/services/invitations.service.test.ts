/**
 * Tests for the student invitations service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { resetApiStub } from '@/test/fetchStub';
import { invitationsService } from './invitations.service';


beforeEach(async () => {
  resetApiStub();
  await authService.signIn(TEST_CREDENTIALS);
});

describe('invitationsService', () => {
  it('lists the pending invitations returned by the API', async () => {
    const statuses = (await invitationsService.listInvitations()).map(invitation => invitation.status);
    expect(statuses).toEqual(['pending']);
  });

  it('accepts a pending invitation', async () => {
    expect((await invitationsService.acceptInvitation('inv-1')).courseId).toBeTruthy();
  });

  it('rejects an unknown invitation', async () => {
    await expect(invitationsService.getInvitation('missing')).rejects.toThrow();
  });
});
