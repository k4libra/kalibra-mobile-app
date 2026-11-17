import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Icon, IconBox, Text } from '@/components/ui';
import { colors } from '@/theme/tokens';
import type { StudentInvitation } from '@/types/invitation';

export interface InvitationCardProps {
  invitation: StudentInvitation;
  onAccept?: (invitation: StudentInvitation) => void;
  onReject?: (invitation: StudentInvitation) => void;
}

/** Pending invitations can be answered; expired invitations explain how to request a new one. */
export function InvitationCard({ invitation, onAccept, onReject }: InvitationCardProps) {
  const isPending = invitation.status === 'pending';
  return (
    <Card style={[styles.card, !isPending && styles.expired]}>
      <View style={styles.header}>
        <IconBox icon={invitation.icon} size="xl" tone={isPending ? 'primary' : 'neutral'} />
        <View style={styles.titles}>
          <Text variant="title" color={isPending ? 'primary' : 'secondary'}>{invitation.courseName}</Text>
          <View style={styles.teacher}><Icon name="school" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary" style={styles.teacherName}>{[invitation.teacherName, invitation.courseCode].filter(Boolean).join(' · ')}</Text></View>
        </View>
      </View>
      <View style={styles.row}>
        <Chip label={invitation.validity} tone={isPending ? 'warning' : 'neutral'} icon="schedule" />
        <Text variant="bodyM" color="secondary">Enviada el {invitation.sentAt}</Text>
      </View>
      {isPending ? (
        <View style={styles.actions}>
          <Button label="Rechazar" variant="ghost" size="sm" onPress={() => onReject?.(invitation)} style={styles.action} />
          <Button label="Aceptar" icon="check" iconPosition="start" size="sm" onPress={() => onAccept?.(invitation)} style={styles.action} />
        </View>
      ) : (
        <View style={styles.info}><Icon name="help" size="sm" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary" style={styles.infoCopy}>Esta invitación venció sin respuesta. Pide a tu docente que te la reenvíe para unirte al curso.</Text></View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 24, gap: 14 },
  expired: { gap: 12, backgroundColor: colors.surfaceBackground, borderWidth: 1, borderColor: colors.surfaceBorder, shadowOpacity: 0, elevation: 0 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  titles: { flex: 1, gap: 2 },
  teacher: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherName: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1 },
  info: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.white, gap: 8 },
  infoCopy: { flex: 1 },
});
