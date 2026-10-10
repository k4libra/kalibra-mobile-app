/**
 * Simulated student invitations endpoints with sample data taken from the Figma mockups.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InvitationsContract } from '@/services/invitations.contract';
import type { StudentInvitation } from '@/types/invitation';
import { respond } from './scenario';

/**
 * Sample invitations of the student.
 */
export const INVITATIONS: StudentInvitation[] = [
  { id: 'inv-1', courseId: 'course-1', courseName: 'Algoritmos y Estructuras de Datos', courseCode: 'CS-204', term: '2025-I', teacherName: 'Ricardo Salas Vega', icon: 'account_tree', sentAt: '03 sep', validity: 'Vence en 2 días', status: 'pending' },
  { id: 'inv-2', courseId: 'course-5', courseName: 'Matemática Discreta', courseCode: 'MA-105', term: '2025-I', teacherName: 'Dra. Carmen Rojas', icon: 'gesture', sentAt: '28 ago', validity: 'Vencida', status: 'expired' },
];

// Finds an invitation or rejects like the backend would.
function find(invitationId: string): Promise<StudentInvitation> {
  const invitation = INVITATIONS.find(item => item.id === invitationId);
  return invitation ? respond(invitation) : Promise.reject(new Error(`Invitation ${invitationId} not found`));
}

/**
 * Simulated implementation of {@link InvitationsContract}.
 */
export const invitationsMock: InvitationsContract = {
  listInvitations: () => respond(INVITATIONS),
  getInvitation: find,
  acceptInvitation: find,
  rejectInvitation: invitationId => find(invitationId).then(() => undefined),
};
