/**
 * Overall progress card of a course.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Icon, MasteryRing, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';
import type { TextColor } from '@/components/ui';
import type { CourseProgress } from '@/types/progress';
import { HIGH_MASTERY_THRESHOLD, LOW_MASTERY_THRESHOLD } from '@/utils/mastery';

/**
 * Performance bands of the overall mastery.
 */
export type ProgressBand = 'optimal' | 'steady' | 'reinforce';

// Status line, level name and color of each band.
const BAND: Record<ProgressBand, { status: string; level: string; color: TextColor; dot: string }> = {
  optimal: { status: 'EN TRAYECTORIA ÓPTIMA', level: 'Avanzado', color: 'success', dot: colors.secondaryStrong },
  steady: { status: 'EN TRAYECTORIA ÓPTIMA', level: 'Intermedio Avanzado', color: 'success', dot: colors.secondaryStrong },
  reinforce: { status: 'NECESITA REFUERZO', level: 'Inicial', color: 'danger', dot: colors.danger },
};

/**
 * Chooses the band of an overall mastery.
 *
 * @param mastery - Overall mastery from 0 to 100.
 * @returns `optimal` from the high threshold, `steady` from the low threshold, otherwise `reinforce`.
 */
export function progressBand(mastery: number): ProgressBand {
  if (mastery >= HIGH_MASTERY_THRESHOLD) return 'optimal';
  if (mastery >= LOW_MASTERY_THRESHOLD) return 'steady';
  return 'reinforce';
}

/**
 * Props accepted by {@link ProgressOverviewCard}.
 */
export interface ProgressOverviewCardProps {
  /** Progress of the course; its mastery must not be `null`. */
  progress: CourseProgress;
}

/**
 * Shows the level, solved exercises, practiced subtopics and the overall mastery ring of a course.
 */
export function ProgressOverviewCard({ progress }: ProgressOverviewCardProps) {
  const mastery = progress.course.mastery ?? 0;
  const band = BAND[progressBand(mastery)];
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: band.dot }]} />
            <Text variant="labelS" color={band.color}>
              {band.status}
            </Text>
          </View>
          <Text variant="headlineL">{band.level}</Text>
          <Text variant="bodyM" color="secondary">
            Has resuelto {progress.course.solvedExerciseCount} ejercicios en este curso.
          </Text>
        </View>
        <MasteryRing value={mastery} label={`Dominio global ${mastery}%`}>
          <Text variant="headlineL">{mastery}%</Text>
          <Text variant="labelM" color="secondary">
            global
          </Text>
        </MasteryRing>
      </View>
      <View style={styles.status}>
        <Icon name="bolt" size="xs" color={colors.secondaryStrong} />
        <Text variant="labelS">
          {progress.practicedSubtopicCount} de {progress.subtopics.length} subtemas con práctica
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  flex: { flex: 1, gap: spacing.xs },
  status: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: radius.full },
});
