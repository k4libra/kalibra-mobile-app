/**
 * Course invitations screen of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { InvitationCard } from '@/components/courses';
import { AppHeader, BackLink, ScreenContainer } from '@/components/layout';
import { ConfirmDialog, EmptyState, ErrorState, LoadingState, SectionTitle, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useInvitations } from '@/hooks/useInvitations';
import type { RootScreenProps } from '@/navigation/types';
import { spacing } from '@/theme/tokens';
import type { StudentInvitation } from '@/types/invitation';
import { plural } from '@/utils/plural';

/**
 * Shows the pending and expired invitations and asks for confirmation before answering, using {@link useInvitations}.
 */
export function InvitationsScreen({ navigation }: RootScreenProps<'Invitations'>) {
  const { pending, expired, accept, reject, isLoading, isSubmitting, error } = useInvitations();
  const { student } = useCurrentStudent();
  const [toAccept, setToAccept] = useState<StudentInvitation | null>(null);
  const [toReject, setToReject] = useState<StudentInvitation | null>(null);
  const goToCourses = () => navigation.navigate('Tabs', { screen: 'Courses' });

  const confirmAccept = async () => {
    if (!toAccept || isSubmitting) return;
    const accepted = await accept(toAccept.id);
    setToAccept(null);
    if (accepted) navigation.replace('EnrollmentConfirmed', { invitationId: accepted.id });
  };

  const confirmReject = async () => {
    if (!toReject || isSubmitting) return;
    await reject(toReject.id);
    setToReject(null);
  };

  return (
    <ScreenContainer
      header={
        <AppHeader title="Invitaciones" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />
      }
    >
      <View style={styles.heading}>
        <BackLink label="Mis cursos" onPress={goToCourses} />
        <Text variant="headlineL" isHeading>
          Invitaciones a cursos
        </Text>
        <Text variant="bodyM" color="secondary">
          Tu docente te invita a su curso usando tu correo registrado. Cada invitación vence a los 3 días.
        </Text>
      </View>

      {error && <ErrorState message={error} />}

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <View style={styles.section}>
            <SectionTitle title="Pendientes" caption={plural(pending.length, 'invitación', 'invitaciones')} />
            {pending.length > 0 ? (
              pending.map(invitation => (
                <InvitationCard key={invitation.id} invitation={invitation} onAccept={setToAccept} onReject={setToReject} />
              ))
            ) : (
              <EmptyState
                icon="notifications"
                title="No tienes invitaciones pendientes"
                description="Cuando tu docente te invite a un curso, verás el aviso en la campana de notificaciones."
                actionLabel="Volver a mis cursos"
                onAction={goToCourses}
              />
            )}
          </View>
          {expired.length > 0 && (
            <View style={styles.section}>
              <SectionTitle title="Vencidas" caption={plural(expired.length, 'invitación', 'invitaciones')} />
              {expired.map(invitation => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </View>
          )}
        </>
      )}

      <ConfirmDialog
        isVisible={toAccept !== null}
        icon="school"
        title={`¿Unirte a ${toAccept?.courseName ?? ''}?`}
        description="Quedarás matriculado en el curso y podrás practicar sus subtemas desde hoy."
        confirmLabel="Sí, unirme al curso"
        confirmIcon="check"
        onConfirm={confirmAccept}
        onCancel={() => setToAccept(null)}
      />
      <ConfirmDialog
        isVisible={toReject !== null}
        icon="close"
        tone="danger"
        title="¿Rechazar la invitación?"
        description={`No te matricularás en ${toReject?.courseName ?? ''}. Tu docente podrá reenviarte la invitación.`}
        confirmLabel="Sí, rechazar"
        confirmIcon="close"
        onConfirm={confirmReject}
        onCancel={() => setToReject(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs },
  section: { gap: spacing.xl },
});
