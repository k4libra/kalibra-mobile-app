/**
 * Mastery row of a subtopic in the progress breakdown.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconBox, ProgressBar, Text } from '@/components/ui';
import type { TextColor } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import type { SubtopicProgress } from '@/types/progress';
import type { Tone } from '@/types/ui';
import { masteryTone } from '@/utils/mastery';

// Level name and text color of each mastery tone.
const LEVEL: Record<Tone, { label: string; color: TextColor }> = {
  success: { label: 'Nivel Alto', color: 'success' },
  warning: { label: 'Nivel Medio', color: 'warning' },
  danger: { label: 'Nivel Bajo', color: 'danger' },
  neutral: { label: 'Sin práctica', color: 'muted' },
  primary: { label: 'Nivel', color: 'brand' },
};

/**
 * Props accepted by {@link SubtopicProgressRow}.
 */
export interface SubtopicProgressRowProps {
  /** Subtopic to show. */
  subtopic: SubtopicProgress;
}

/**
 * Shows the mastery level, right answers and mastery bar of a subtopic.
 */
export function SubtopicProgressRow({ subtopic }: SubtopicProgressRowProps) {
  const tone = masteryTone(subtopic.mastery);
  const level = LEVEL[tone];
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <IconBox icon={subtopic.icon} tone={tone === 'neutral' ? 'neutral' : tone} size="md" />
        <View style={styles.flex}>
          <Text variant="title" numberOfLines={1}>
            {subtopic.name}
          </Text>
          <Text variant="labelM" color={level.color}>
            {level.label}
            {subtopic.attemptCount > 0 ? ` • ${subtopic.correctCount}/${subtopic.attemptCount} correctos` : ''}
          </Text>
        </View>
        <Text variant="headlineM">{subtopic.mastery === null ? '—' : `${subtopic.mastery}%`}</Text>
      </View>
      <ProgressBar value={subtopic.mastery} tone={tone} label={`Dominio en ${subtopic.name}`} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  flex: { flex: 1 },
});
