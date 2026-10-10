/**
 * Card of one recorded answer in the practice history.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, Icon, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import type { AttemptResult, HistoryEntry } from '@/types/progress';
import type { IconName, Tone } from '@/types/ui';

// Chip of each outcome.
const RESULT: Record<AttemptResult, { label: string; tone: Tone; icon: IconName }> = {
  correct: { label: 'Correcto', tone: 'success', icon: 'check_circle' },
  incorrect: { label: 'Incorrecto', tone: 'danger', icon: 'cancel' },
};

/**
 * Props accepted by {@link HistoryEntryCard}.
 */
export interface HistoryEntryCardProps {
  /** Recorded answer to show. */
  entry: HistoryEntry;
  /** Called with the attempt id when the student opens the breakdown. */
  onOpen: (attemptId: string) => void;
}

/**
 * Shows the subtopic, title, outcome, time and duration of an answer and emits when the student opens it.
 */
export function HistoryEntryCard({ entry, onOpen }: HistoryEntryCardProps) {
  const result = RESULT[entry.result];
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${entry.title}. Ver desglose`} onPress={() => onOpen(entry.attemptId)}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Chip label={entry.subtopicName} tone="neutral" />
          <Chip label={result.label} tone={result.tone} icon={result.icon} />
        </View>
        <Text variant="headlineM">{entry.title}</Text>
        <View style={styles.meta}>
          <Icon name={entry.isRecent ? 'schedule' : 'calendar_month'} size="sm" color={colors.contentSecondary} />
          <Text variant="bodyM" color="secondary">
            {entry.answeredAt}
          </Text>
          {entry.duration && (
            <Text variant="bodyMBold" color={entry.result === 'correct' ? 'brand' : 'danger'}>
              • {entry.duration}
            </Text>
          )}
        </View>
        <View style={styles.row}>
          <View style={styles.link}>
            <Text variant="labelL" color="brand">
              Toca para ver desglose
            </Text>
            <Icon name="chevron_right" size="sm" color={colors.primaryStrong} />
          </View>
          {entry.isPendingReview && <Chip label="Pendiente" tone="danger" />}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  link: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
