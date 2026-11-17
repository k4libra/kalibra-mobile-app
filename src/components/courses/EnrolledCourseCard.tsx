/** Compact enrolled course row with measured mastery and teacher identity. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, Icon, IconBox, ProgressBar, Text, type TextColor } from '@/components/ui';
import { colors, radius } from '@/theme/tokens';
import type { EnrolledCourse } from '@/types/course';
import type { Tone } from '@/types/ui';

/** Props accepted by the course list card. */
export interface EnrolledCourseCardProps {
  course: EnrolledCourse;
  onContinue: (courseId: string) => void;
}

const levelOf = (mastery: number | null): { tone: Tone; label: string; color: TextColor } => mastery === null
  ? { tone: 'neutral', label: 'Sin práctica', color: 'secondary' }
  : mastery > 70 ? { tone: 'success', label: 'Dominio Alto', color: 'success' }
    : mastery >= 40 ? { tone: 'primary', label: 'Dominio Medio', color: 'brand' }
      : { tone: 'warning', label: 'Dominio Bajo', color: 'warning' };

/** Opens the enrolled course and preserves exact percentages only when supplied. */
export function EnrolledCourseCard({ course, onContinue }: EnrolledCourseCardProps) {
  const level = levelOf(course.mastery);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Ver curso ${course.name}`} onPress={() => onContinue(course.id)}>
    <Card style={styles.card}>
      <View style={styles.row}>
        <IconBox icon={course.icon} size="xl" tone="primary" />
        <View style={styles.titles}>
          <Text variant="title">{course.name}</Text>
          <Text variant="bodyM" color="secondary" numberOfLines={2}>{course.focus || `${course.subtopicCount} subtemas para practicar`}</Text>
          <View style={styles.teacher}><Icon name="school" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary" style={styles.flex}>{course.teacherName ?? 'Docente no disponible'}</Text></View>
        </View>
        <View style={styles.chevron}><Icon name="chevron_right" size="md" color={colors.contentSecondary} /></View>
      </View>
      <View style={styles.progress}>
        <Chip label={level.label} icon="query_stats" tone={level.tone} />
        <View style={styles.flex}><ProgressBar value={course.mastery} tone={level.tone} label={`Dominio en ${course.name}`} /></View>
        <Text variant="bodyMBold" color={level.color}>{course.mastery === null ? '—' : `${course.mastery} %`}</Text>
      </View>
      <View style={styles.meta}><Icon name="check_circle" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">{course.masteredSubtopicCount}/{course.subtopicCount} temas dominados</Text></View>
    </Card>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 24, gap: 12 }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, titles: { flex: 1, gap: 2 }, flex: { flex: 1 }, teacher: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chevron: { width: 32, height: 32, borderRadius: radius.full, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 8 }, meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
