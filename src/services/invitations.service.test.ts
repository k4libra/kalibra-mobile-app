/**
 * Tests for the student invitations service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { authService } from '@/services/auth.service';
import { TEST_CREDENTIALS, TEST_INVITATION } from '@/test/apiFixtures';
import { jsonResponse, resetApiStub } from '@/test/fetchStub';
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

test('loads both status filters and deduplicates invitations that expired between reads', async () => {
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockClear();
  fetchSpy.mockImplementation((url, init) => {
    if (String(url).endsWith('/invitations?status=PENDING')) return Promise.resolve(jsonResponse([TEST_INVITATION]));
    if (String(url).endsWith('/invitations?status=EXPIRED')) return Promise.resolve(jsonResponse([{ ...TEST_INVITATION, courseId: 'course-4', teacherName: 'Profesora Test', status: 'EXPIRED' }]));
    return original(url, init);
  });
  const invitations = await invitationsService.listInvitations();
  expect(invitations).toHaveLength(1);
  expect(invitations[0]).toMatchObject({ id: TEST_INVITATION.id, courseId: 'course-4', teacherName: 'Profesora Test', status: 'expired' });
  expect(fetchSpy.mock.calls.map(([url]) => String(url).split('?')[1])).toEqual(['status=PENDING', 'status=EXPIRED']);
});
