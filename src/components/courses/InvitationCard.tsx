/**
 * Card of a course invitation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, IconBox, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import type { StudentInvitation } from '@/types/invitation';

/**
 * Props accepted by {@link InvitationCard}.
 */
export interface InvitationCardProps {
  /** Invitation to show. */
  invitation: StudentInvitation;
  /** Called when the student wants to accept a pending invitation. */
  onAccept?: (invitation: StudentInvitation) => void;
  /** Called when the student wants to reject a pending invitation. */
  onReject?: (invitation: StudentInvitation) => void;
}

/**
 * Shows the course, teacher and validity of an invitation; pending ones offer accept and reject actions.
 */
export function InvitationCard({ invitation, onAccept, onReject }: InvitationCardProps) {
  const isPending = invitation.status === 'pending';
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <IconBox icon={invitation.icon} tone={isPending ? 'warning' : 'success'} />
        <View style={styles.titles}>
          <Text variant="title" color={isPending ? 'primary' : 'secondary'}>
            {invitation.courseName}
          </Text>
          <Text variant="bodyM" color="secondary">
            {invitation.teacherName} · {invitation.courseCode}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <Chip label={invitation.validity} tone={isPending ? 'warning' : 'neutral'} icon={isPending ? 'schedule' : 'event_busy'} />
        <Text variant="bodyM" color="secondary">
          Enviada el {invitation.sentAt}
        </Text>
      </View>
      {isPending ? (
        <View style={styles.actions}>
          <Button label="Rechazar" variant="tonal" onPress={() => onReject?.(invitation)} style={styles.action} />
          <Button label="Aceptar" onPress={() => onAccept?.(invitation)} style={styles.action} />
        </View>
      ) : (
        <Text variant="bodyM" color="secondary">
          Esta invitación venció sin respuesta. Pide a tu docente que te la reenvíe para unirte al curso.
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  header: { flexDirection: 'row', gap: spacing.xl },
  titles: { flex: 1, gap: spacing.xxs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1 },
});
