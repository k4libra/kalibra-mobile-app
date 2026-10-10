/**
 * Student invitations service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InvitationsContract } from '@/services/invitations.contract';
import type { PendingInvitationDto, InvitationDto } from '@/types/api';
import type { StudentInvitation } from '@/types/invitation';
import { apiClient, ApiError } from '@/services/http/apiClient';
import { getSessionRevision, subscribeSession } from '@/services/http/session';
import { getEnrolledCourse } from '@/services/http/studentData';
import { mapInvitation } from '@/services/mappers/invitations';
const accepted = new Map<string, StudentInvitation>();
subscribeSession(() => accepted.clear());
/** Lists pending invitations and preserves accepted metadata for the confirmation route. */
export const invitationsService: InvitationsContract = {
  /** {@inheritDoc InvitationsContract.listInvitations} */
  async listInvitations() {
    return (
      await apiClient.get<PendingInvitationDto[]>('/invitations?status=PENDING')
    ).map(item => mapInvitation(item));
  },
  /** {@inheritDoc InvitationsContract.getInvitation} */
  async getInvitation(invitationId) {
    const cached = accepted.get(invitationId);
    if (cached) return cached;
    const pending = (await invitationsService.listInvitations()).find(
      item => item.id === invitationId,
    );
    if (!pending) throw new ApiError(404, 'NOT_FOUND');
    return pending;
  },
  /** {@inheritDoc InvitationsContract.acceptInvitation} */
  async acceptInvitation(invitationId) {
    const revision = getSessionRevision();
    const pending = await invitationsService.getInvitation(invitationId);
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    const dto = await apiClient.post<InvitationDto>(
      `/invitations/${encodeURIComponent(invitationId)}/acceptances`,
    );
    const course = await getEnrolledCourse(dto.courseId);
    if (revision !== getSessionRevision())
      throw new ApiError(401, 'UNAUTHORIZED');
    const invitation = {
      ...pending,
      courseId: dto.courseId,
      courseName: course.name,
      courseCode: course.code,
      teacherName: course.teacherName,
    };
    accepted.set(invitationId, invitation);
    return invitation;
  },
  /** {@inheritDoc InvitationsContract.rejectInvitation} */
  async rejectInvitation(invitationId) {
    await apiClient.post(
      `/invitations/${encodeURIComponent(invitationId)}/rejections`,
    );
    accepted.delete(invitationId);
  },
};
