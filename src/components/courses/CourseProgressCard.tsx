/**
 * Overall progress of the student in a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Icon, IconBox, Text } from '@/components/ui';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import type { EnrolledCourse } from '@/types/course';

/**
 * Props accepted by {@link CourseProgressCard}.
 */
export interface CourseProgressCardProps {
  /** Course whose progress is shown. */
  course: EnrolledCourse;
}

/**
 * Shows the overall mastery, the mastered subtopics, the solved exercises and the estimated time left.
 */
export function CourseProgressCard({ course }: CourseProgressCardProps) {
  const percent = course.mastery ?? 0;
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <IconBox icon="bar_chart" size="sm" />
        <View style={styles.titles}>
          <Text variant="bodyMBold">Progreso general</Text>
          <Text variant="bodyM" color="secondary">
            {course.masteredSubtopicCount} de {course.subtopicCount} subtemas con dominio alto
          </Text>
        </View>
        <Text variant="headlineL" color="brand">
          {percent}
          <Text variant="bodyMBold" color="brand">
            {' '}%
          </Text>
        </Text>
      </View>
      <View accessibilityRole="progressbar" accessibilityLabel={`Progreso general en ${course.name}`} style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
      <View style={styles.row}>
        <View style={styles.meta}>
          <Icon name="check_circle" size="xs" color={colors.secondaryStrong} />
          <Text variant="labelS" color="secondary">
            {course.solvedExerciseCount} ejercicios resueltos
          </Text>
        </View>
        <View style={styles.meta}>
          <Icon name="timelapse" size="xs" color={colors.tertiaryStrong} />
          <Text variant="labelS" color="secondary">
            {course.estimatedTimeLeft} estimadas restantes
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  titles: { flex: 1 },
  track: { height: 10, padding: 2, borderRadius: radius.full, backgroundColor: colors.primaryContainer },
  fill: { height: '100%', borderRadius: radius.full, experimental_backgroundImage: gradients.progress },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
