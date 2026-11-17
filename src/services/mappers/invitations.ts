/**
 * Maps invitation dates and the metadata actually exposed by the API.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { PendingInvitationDto } from '@/types/api';
import type { StudentInvitation } from '@/types/invitation';
import { formatShortDayMonth } from '@/utils/term';
/**
 * Maps invitation identity and expiry from both status-filtered resources.
 *
 * @param dto - Pending invitation as returned by the API.
 * @param now - Reference time in epoch milliseconds for expiry classification.
 * @returns Invitation UI data with email fallback for missing sender names.
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
  const expired = dto.status === 'EXPIRED' || Date.parse(dto.expiresAt) <= now;
  return {
    id: dto.id,
    courseId: dto.courseId ?? '',
    courseName: dto.courseName,
    courseCode: '',
    term: '',
    teacherName: dto.teacherName?.trim() || dto.teacherEmail,
    icon: /algorit|programa|estructura/i.test(dto.courseName) ? 'account_tree' : /álgebra|algebra/i.test(dto.courseName) ? 'grid_on' : /cálculo|calculo/i.test(dto.courseName) ? 'functions' : 'menu_book',
    sentAt: formatShortDayMonth(dto.sentAt),
    validity: expired
      ? 'Vencida'
      : `Vence en ${Math.max(1, Math.ceil((Date.parse(dto.expiresAt) - now) / 86400000))} ${Math.ceil((Date.parse(dto.expiresAt) - now) / 86400000) <= 1 ? 'día' : 'días'}`,
    status: expired ? 'expired' : 'pending',
  };
}
