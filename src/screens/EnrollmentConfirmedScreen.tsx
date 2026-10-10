/**
 * Confirmation screen after accepting a course invitation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Button, Card, ErrorState, HeroBanner, IconBox, LoadingState, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useAcceptedInvitation } from '@/hooks/useInvitations';
import type { RootScreenProps } from '@/navigation/types';
import { spacing } from '@/theme/tokens';

/**
 * Celebrates the enrollment in the course of the accepted invitation, using {@link useAcceptedInvitation}.
 */
export function EnrollmentConfirmedScreen({ navigation, route }: RootScreenProps<'EnrollmentConfirmed'>) {
  const { invitation, isLoading, error } = useAcceptedInvitation(route.params.invitationId);
  const { student } = useCurrentStudent();

  return (
    <ScreenContainer
      header={<AppHeader title="Matrícula" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}
    >
      {error && <ErrorState message={error} />}
      {isLoading || !invitation ? (
        <LoadingState />
      ) : (
        <>
          <HeroBanner
            tone="success"
            icon="check_circle"
            title="¡Ya estás inscrito!"
            message={`Te uniste a ${invitation.courseName}.`}
            pillIcon="workspace_premium"
            pillLabel={`Matrícula activa · Ciclo ${invitation.term}`}
          />
          <Card style={styles.card}>
            <View style={styles.row}>
              <IconBox icon={invitation.icon} />
              <View style={styles.titles}>
                <Text variant="title">{invitation.courseName}</Text>
                <Text variant="bodyM" color="secondary">
                  {invitation.teacherName} · {invitation.courseCode}
                </Text>
              </View>
            </View>
            <Text variant="bodyM" color="secondary">
              Tu docente ya puede ver tu avance. Tu progreso por subtema se registra desde tu primer ejercicio.
            </Text>
          </Card>
          <Button label="Ir al curso" icon="arrow_forward" onPress={() => navigation.replace('CourseSubtopics', { courseId: invitation.courseId })} />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  titles: { flex: 1, gap: spacing.xxs },
});
