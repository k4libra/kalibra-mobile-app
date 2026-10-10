/**
 * Card of a course the student is enrolled in.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, IconBox, ProgressBar, Text, type TextColor } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import type { EnrolledCourse } from '@/types/course';
import type { Tone } from '@/types/ui';

// Accent of the card by progress: high progress is green, medium indigo and low amber.
const courseTone = (mastery: number | null): Tone => (mastery === null ? 'neutral' : mastery >= 80 ? 'success' : mastery >= 65 ? 'primary' : 'warning');

// Text color of the percentage for each accent.
const PERCENT_COLOR: Record<Tone, TextColor> = {
  primary: 'brand',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  neutral: 'muted',
};

/**
 * Props accepted by {@link EnrolledCourseCard}.
 */
export interface EnrolledCourseCardProps {
  /** Course to show. */
  course: EnrolledCourse;
  /** Called when the student wants to keep practicing the course. */
  onContinue: (courseId: string) => void;
}

/**
 * Shows the progress of the student in a course and emits when they continue practicing.
 */
export function EnrolledCourseCard({ course, onContinue }: EnrolledCourseCardProps) {
  const tone = courseTone(course.mastery);
  const percent = course.mastery ?? 0;
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <IconBox icon={course.icon} tone={tone === 'neutral' ? 'primary' : tone} />
        <View style={styles.titles}>
          <View style={styles.titleRow}>
            <Text variant="title" numberOfLines={1} style={styles.name}>
              {course.name}
            </Text>
            <Text variant="bodyMBold" color={PERCENT_COLOR[tone]}>
              {percent}%
            </Text>
          </View>
          <Text variant="bodyM" color="secondary">
            {course.focus}
          </Text>
        </View>
      </View>
      <View style={styles.progress}>
        <View style={styles.titleRow}>
          {tone === 'success' ? (
            <Chip label="¡Excelente ritmo!" tone="success" icon="bolt" />
          ) : (
            <Text variant="labelS" color="secondary">
              {course.masteredSubtopicCount}/{course.subtopicCount} temas dominados
            </Text>
          )}
          <Text variant="labelM">{percent}% completado</Text>
        </View>
        <ProgressBar value={course.mastery} tone={tone === 'warning' ? 'warning' : tone} label={`Progreso en ${course.name}`} />
      </View>
      <Button
        label="Continuar práctica"
        icon="arrow_forward"
        variant={tone === 'success' ? 'primary' : 'tonal'}
        onPress={() => onContinue(course.id)}
        style={tone === 'success' && styles.successButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xl },
  header: { flexDirection: 'row', gap: spacing.xl },
  titles: { flex: 1, gap: spacing.xxs },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  name: { flex: 1 },
  progress: { gap: spacing.sm },
  successButton: { backgroundColor: colors.secondaryStrong },
});
