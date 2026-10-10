/**
 * Courses tab of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EnrolledCourseCard, MomentumCard, QuickPracticeCard } from '@/components/courses';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Chip, EmptyState, ErrorState, LoadingState, SectionTitle, Text } from '@/components/ui';
import { useMyCourses } from '@/hooks/useMyCourses';
import { useRootNavigation } from '@/navigation/useRootNavigation';
import { spacing } from '@/theme/tokens';

/**
 * Shows the greeting, the practice summary and the enrolled courses, using {@link useMyCourses}.
 */
export function MyCoursesScreen() {
  const navigation = useRootNavigation();
  const { student, courses, isLoading, error } = useMyCourses();
  const hasCourses = courses.length > 0;
  const openCourse = (courseId: string) => navigation.navigate('CourseSubtopics', { courseId });
  const openInvitations = () => navigation.navigate('Invitations');

  return (
    <ScreenContainer
      header={
        <AppHeader
          avatar={student?.avatar}
          onNotifications={openInvitations}
          onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })}
        />
      }
    >
      <View style={styles.greeting}>
        <View style={styles.row}>
          <Text variant="headlineL" isHeading>
            Hola, {student?.firstName ?? ''}
          </Text>
          {student && <Chip label={`Ciclo ${student.term}`} />}
        </View>
        <Text color="secondary">{hasCourses || isLoading ? 'Tus cursos activos este ciclo' : 'Aún no tienes cursos este ciclo'}</Text>
      </View>

      {error && <ErrorState message={error} />}

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {hasCourses && student && <MomentumCard solvedExerciseCount={student.solvedExerciseCount} averageMastery={student.averageMastery} />}
          <View style={styles.section}>
            <SectionTitle title="Cursos inscritos" caption={`${courses.length} en curso`} />
            {hasCourses ? (
              courses.map(course => <EnrolledCourseCard key={course.id} course={course} onContinue={openCourse} />)
            ) : (
              <EmptyState
                icon="school"
                title="Aún no estás inscrito en ningún curso"
                description="Tu docente te enviará una invitación a tu correo registrado. Acéptala para empezar a practicar."
                actionLabel={`Ver invitaciones (${student?.pendingInvitationCount ?? 0})`}
                onAction={openInvitations}
              />
            )}
          </View>
          {hasCourses && (
            <QuickPracticeCard onPress={() => openCourse(courses[0].id)} />
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greeting: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  section: { gap: spacing.xl },
});
