/**
 * Maps invitation dates and the metadata actually exposed by the API.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PendingInvitationDto } from '@/types/api';
import type { StudentInvitation } from '@/types/invitation';
/**
 * Maps a pending invitation; course identity becomes available only after acceptance.
 *
 * @param dto - Pending invitation as returned by the API.
 * @param now - Reference time in epoch milliseconds for expiry classification.
 * @returns Invitation UI data; course identity remains unavailable before acceptance.
 *
 * @example
 * ```ts
 * mapInvitation(invitationDto, Date.now()).validity;
 * ```
 */
export function mapInvitation(
  dto: PendingInvitationDto,
  now: number = Date.now(),
): StudentInvitation {
  const expired = Date.parse(dto.expiresAt) <= now;
  return {
    id: dto.id,
    courseId: '',
    courseName: dto.courseName,
    courseCode: '',
    term: '',
    teacherName: dto.teacherEmail,
    icon: 'menu_book',
    sentAt: new Date(dto.sentAt).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
    }),
    validity: expired
      ? 'Invitación vencida'
      : `Vence el ${new Date(dto.expiresAt).toLocaleDateString('es-PE')}`,
    status: expired ? 'expired' : 'pending',
  };
}
