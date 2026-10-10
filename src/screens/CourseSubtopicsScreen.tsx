/**
 * Subtopics screen of an enrolled course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CourseProgressCard, SubtopicCard } from '@/components/courses';
import { AppHeader, BackLink, ScreenContainer } from '@/components/layout';
import { Chip, EmptyState, ErrorState, LoadingState, Text } from '@/components/ui';
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import type { RootScreenProps } from '@/navigation/types';
import { spacing } from '@/theme/tokens';
import { plural } from '@/utils/plural';

/**
 * Shows the progress and the subtopics of the course in the route, using {@link useCourseSubtopics}.
 */
export function CourseSubtopicsScreen({ navigation, route }: RootScreenProps<'CourseSubtopics'>) {
  const { courseId } = route.params;
  const { course, subtopics, isLoading, error } = useCourseSubtopics(courseId);
  const { student } = useCurrentStudent();
  const goToCourses = () => navigation.navigate('Tabs', { screen: 'Courses' });

  return (
    <ScreenContainer
      header={
        <AppHeader title="Subtemas" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />
      }
    >
      <View style={styles.heading}>
        <BackLink label="Mis cursos" onPress={goToCourses} />
        <Text variant="headlineL" isHeading>
          {course?.name ?? ''}
        </Text>
        {course && (
          <Text variant="bodyM" color="secondary">
            {[course.faculty, course.semester, `Código ${course.code}`].filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>

      {error && <ErrorState message={error} />}

      {isLoading ? (
        <LoadingState />
      ) : subtopics.length === 0 ? (
        <EmptyState
          icon="account_tree"
          title="Aún no hay subtemas"
          description="Tu docente todavía no ha registrado los subtemas de este curso. Te avisaremos apenas estén disponibles para practicar."
          actionLabel="Volver a mis cursos"
          onAction={goToCourses}
        />
      ) : (
        <>
          {course && <CourseProgressCard course={course} />}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text variant="headlineM" isHeading>
                Temas de aprendizaje
              </Text>
              <Chip label={plural(subtopics.length, 'unidad', 'unidades')} tone="neutral" />
            </View>
            {subtopics.map(subtopic => (
              <SubtopicCard
                key={subtopic.id}
                subtopic={subtopic}
                onPractice={subtopicId => navigation.navigate('Exercise', { courseId, subtopicId })}
              />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs },
  section: { gap: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
});
