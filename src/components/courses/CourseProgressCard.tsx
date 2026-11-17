/** Course identity and measured practice progress in the shared course hero. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Icon, IconBox, ProgressBar, Text } from '@/components/ui';
import { colors, gradients } from '@/theme/tokens';
import type { EnrolledCourse } from '@/types/course';

/** Controls whether the course has a curriculum to summarize. */
export interface CourseProgressCardProps {
  course: EnrolledCourse;
  showProgress?: boolean;
}

/** Does not infer mastery or study time when the backend supplies neither. */
export function CourseProgressCard({ course, showProgress = true }: CourseProgressCardProps) {
  const teacher = course.teacherName ? `Docente: ${course.teacherName}` : 'Docente no disponible';
  return <Card style={styles.card}>
    <View style={styles.identity}>
      <IconBox icon={course.icon} size="xl" tone="primary" style={styles.icon} />
      <View style={styles.titles}>
        <Text variant="headlineM" isHeading>{course.name}</Text>
        <Text variant="bodyM" color="secondary"><Text variant="bodyM" color="secondary">{teacher}</Text>{` · Código ${course.code}`}</Text>
      </View>
    </View>
    {showProgress && <>
      <View style={styles.progress}>
        <Text variant="display" color="brand" style={styles.percentage}>{course.mastery === null ? '—' : `${course.mastery} %`}</Text>
        <View style={styles.progressCopy}>
          <Text variant="bodyM" color="secondary">Progreso general · {course.masteredSubtopicCount} de {course.subtopicCount} subtemas con dominio alto</Text>
          <ProgressBar value={course.mastery} tone="primary" label={`Progreso general en ${course.name}`} />
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.metaItem}><Icon name="menu_book" size="xs" color={colors.contentPrimary} /><Text variant="bodyM">{course.solvedExerciseCount} ejercicios resueltos</Text></View>
        <View style={styles.metaItem}><Icon name="schedule" size="xs" color={colors.contentPrimary} /><Text variant="bodyM">{course.estimatedTimeLeft ? `${course.estimatedTimeLeft} estimadas restantes` : 'Tiempo no estimado'}</Text></View>
      </View>
    </>}
  </Card>;
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.primaryPaleSoft, borderRadius: 24, padding: 18, gap: 14, experimental_backgroundImage: gradients.soft },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 82 }, icon: { backgroundColor: colors.white }, titles: { flex: 1, gap: 2 },
  progress: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, minHeight: 46 }, percentage: { minWidth: 62 }, progressCopy: { flex: 1, gap: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 }, metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
