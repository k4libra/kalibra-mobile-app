/**
 * Progress tab of the student app.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { CourseSelector, FocusCard, PreviewToggle, ProgressOverviewCard, SubtopicProgressRow } from '@/components/progress';
import { Chip, EmptyState, ErrorState, LoadingState, SectionTitle, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useProgress } from '@/hooks/useProgress';
import { useRootNavigation } from '@/navigation/useRootNavigation';
import { spacing } from '@/theme/tokens';
import { plural } from '@/utils/plural';

/**
 * Shows the overall mastery, the urgent subtopic and the breakdown of the selected course, using {@link useProgress}.
 *
 * @remarks
 * "Ver vista inicial" previews the state of a student who has not practiced the course yet.
 */
export function ProgressScreen() {
  const navigation = useRootNavigation();
  const { student } = useCurrentStudent();
  const { courses, selectedCourseId, selectCourse, progress, isLoading, error } = useProgress();
  const [isInitialPreview, setIsInitialPreview] = useState(false);
  const hasActivity = Boolean(progress && progress.course.mastery !== null) && !isInitialPreview;

  const practice = (subtopicId: string) => {
    if (selectedCourseId) navigation.navigate('Exercise', { courseId: selectedCourseId, subtopicId });
  };
  const startPracticing = () => {
    const first = progress?.subtopics[0];
    if (first && selectedCourseId) practice(first.id);
    else if (selectedCourseId) navigation.navigate('CourseSubtopics', { courseId: selectedCourseId });
    else navigation.navigate('Tabs', { screen: 'Courses' });
  };

  return (
    <ScreenContainer
      header={<AppHeader avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}
    >
      <View style={styles.heading}>
        <View style={styles.row}>
          <Chip label="PANEL ANALÍTICO" />
          {progress && progress.course.mastery !== null && (
            <PreviewToggle
              label={isInitialPreview ? 'Ver mi progreso' : 'Ver vista inicial'}
              onPress={() => setIsInitialPreview(value => !value)}
            />
          )}
        </View>
        <Text variant="headlineL" isHeading>
          Mi Progreso Académico
        </Text>
        {selectedCourseId && <CourseSelector courses={courses} selectedCourseId={selectedCourseId} onSelect={selectCourse} />}
      </View>

      {error && <ErrorState message={error} />}

      {isLoading ? (
        <LoadingState />
      ) : !progress || !hasActivity ? (
        <EmptyState
          icon="hub"
          title="Aún no estimamos tu dominio"
          description="Resuelve tu primer ejercicio y Kalibra empezará a estimar tu nivel de dominio en cada subtema."
          actionLabel="Empezar a practicar"
          onAction={startPracticing}
        />
      ) : (
        <>
          <ProgressOverviewCard progress={progress} />
          {progress.focus && <FocusCard focus={progress.focus} onReinforce={practice} />}
          <View style={styles.section}>
            <SectionTitle title="Desglose por Subtemas" caption={plural(progress.subtopics.length, 'unidad', 'unidades')} />
            {progress.subtopics.map(subtopic => (
              <SubtopicProgressRow key={subtopic.id} subtopic={subtopic} />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { gap: spacing.lg },
});
