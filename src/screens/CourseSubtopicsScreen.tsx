/** Enrolled curriculum and the student's measured mastery for each subtopic. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CourseProgressCard, SubtopicCard } from '@/components/courses';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Button, Card, ErrorState, Icon, LoadingState, Text } from '@/components/ui';
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import type { RootScreenProps } from '@/navigation/types';
import { gradients } from '@/theme/tokens';
import { plural } from '@/utils/plural';

/** Opens real five-exercise practice sessions from the course's registered subtopics. */
export function CourseSubtopicsScreen({ navigation, route }: RootScreenProps<'CourseSubtopics'>) {
  const { courseId } = route.params;
  const { course, subtopics, isLoading, error } = useCourseSubtopics(courseId);
  const { student } = useCurrentStudent();
  const goToCourses = () => navigation.navigate('Tabs', { screen: 'Courses' });

  return <ScreenContainer header={<AppHeader title="Subtemas" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}>
    <View style={styles.stack}>
      {error && <ErrorState message={error} />}
      {isLoading ? <LoadingState /> : <>
        {course && <CourseProgressCard course={course} showProgress={subtopics.length > 0} />}
        {subtopics.length === 0 ? <Card style={styles.empty}>
          <View style={styles.illustration}><Icon name="layers" size="4xl" /></View>
          <Text variant="headlineM" isHeading style={styles.center}>Aún no hay subtemas</Text>
          <Text color="secondary" style={styles.center}>Tu docente todavía no ha registrado los subtemas de este curso. Te avisaremos apenas estén disponibles para practicar.</Text>
          <Button label="Volver a mis cursos" variant="tonal" onPress={goToCourses} style={styles.stretch} />
        </Card> : <View style={styles.stack}>
          <View style={styles.heading}><Text variant="headlineM" isHeading>Temas de aprendizaje</Text><Text variant="bodyMBold" color="brand">{plural(subtopics.length, 'unidad', 'unidades')}</Text></View>
          {subtopics.map(subtopic => <SubtopicCard key={subtopic.id} subtopic={subtopic} onPractice={subtopicId => navigation.navigate('Exercise', { courseId, subtopicId, calibration: { name: subtopic.name, mastery: subtopic.mastery } })} />)}
        </View>}
      </>}
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  stack: { gap: 20 }, heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 24, gap: 12 },
  empty: { padding: 24, borderRadius: 24, alignItems: 'center', gap: 14 }, illustration: { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center', experimental_backgroundImage: gradients.soft }, center: { textAlign: 'center' }, stretch: { alignSelf: 'stretch' },
});
