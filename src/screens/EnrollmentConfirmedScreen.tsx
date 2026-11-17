import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Button, Card, Chip, ErrorState, Icon, IconBox, LoadingState, Text } from '@/components/ui';
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useAcceptedInvitation } from '@/hooks/useInvitations';
import type { RootScreenProps } from '@/navigation/types';
import { colors, shadows } from '@/theme/tokens';
import type { StudentInvitation } from '@/types/invitation';
import { plural } from '@/utils/plural';

/** Reads real curriculum counts after enrollment without delaying the successful confirmation. */
function EnrollmentCourse({ invitation }: { invitation: StudentInvitation }) {
  const { subtopics, isLoading, error } = useCourseSubtopics(invitation.courseId);
  return (
    <Card style={styles.course}>
      <View style={styles.header}>
        <IconBox icon={invitation.icon} size="xl" />
        <View style={styles.titles}>
          <Text variant="title">{invitation.courseName}</Text>
          <View style={styles.teacher}><Icon name="school" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary" style={styles.teacherName}>{[invitation.teacherName, invitation.courseCode].filter(Boolean).join(' · ')}</Text></View>
        </View>
      </View>
      <View style={styles.chips}>
        <Chip label={isLoading ? 'Cargando subtemas' : error ? 'Subtemas no disponibles' : plural(subtopics.length, 'subtema', 'subtemas')} icon="menu_book" tone="neutral" />
        <Chip label={invitation.term ? `Ciclo ${invitation.term}` : 'Ciclo actual'} icon="calendar_month" tone="neutral" />
      </View>
      <View style={styles.info}><Icon name="trending_up" size="md" /><Text variant="bodyM" style={styles.infoCopy}>Tu docente ya puede ver tu avance. Tu progreso por subtema se registra desde tu primer ejercicio.</Text></View>
      {error && <ErrorState message={error} />}
    </Card>
  );
}

/** Success confirmation for the accepted invitation and its enrolled course. */
export function EnrollmentConfirmedScreen({ navigation, route }: RootScreenProps<'EnrollmentConfirmed'>) {
  const { invitation, isLoading, error } = useAcceptedInvitation(route.params.invitationId);
  const { student } = useCurrentStudent();
  return (
    <ScreenContainer header={<AppHeader title="Matrícula" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}>
      {error ? <ErrorState message={error} /> : isLoading || !invitation ? <LoadingState /> : (
        <View style={styles.content}>
          <View style={styles.hero} accessibilityRole="summary">
            <View style={styles.badge}><Icon name="check" size="3xl" color={colors.white} /></View>
            <Text variant="display" isHeading style={styles.center}>¡Ya estás inscrito!</Text>
            <Text color="secondary" style={styles.center}>Te uniste a {invitation.courseName}.</Text>
            <Chip label={invitation.term ? `Matrícula activa · Ciclo ${invitation.term}` : 'Matrícula activa · Ciclo actual'} tone="success" icon="check_circle" style={styles.pill} />
          </View>
          <EnrollmentCourse invitation={invitation} />
          <Button label="Ir al curso" icon="arrow_forward" onPress={() => navigation.replace('CourseSubtopics', { courseId: invitation.courseId })} />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { gap: 18 },
  hero: { padding: 24, borderRadius: 24, gap: 12, alignItems: 'center', experimental_backgroundImage: `linear-gradient(146deg, ${colors.secondaryPale} 0%, ${colors.primarySubtle} 100%)` },
  badge: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.secondaryStrong, alignItems: 'center', justifyContent: 'center', ...shadows.raised },
  center: { textAlign: 'center' },
  pill: { backgroundColor: colors.white, alignSelf: 'center' },
  course: { padding: 16, borderRadius: 24, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  titles: { flex: 1, gap: 2 },
  teacher: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherName: { flex: 1 },
  chips: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  info: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 20, backgroundColor: colors.primarySubtle, gap: 10 },
  infoCopy: { flex: 1 },
});
