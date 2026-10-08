/**
 * Card of a subtopic with the mastery of the student.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, IconBox, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';
import type { StudentSubtopic } from '@/types/course';
import type { Tone } from '@/types/ui';
import { masteryTone } from '@/utils/mastery';

// Label of the mastery chip for each tone.
const LEVEL: Record<Tone, string> = {
  success: 'Dominio Alto',
  warning: 'Dominio Medio',
  danger: 'Dominio Bajo',
  neutral: 'No iniciado',
  primary: 'Dominio',
};

// Color of the status dot for each tone.
const DOT: Record<Tone, string> = {
  success: colors.secondaryStrong,
  warning: colors.tertiaryStrong,
  danger: colors.danger,
  neutral: colors.contentMuted,
  primary: colors.primary,
};

/**
 * Props accepted by {@link SubtopicCard}.
 */
export interface SubtopicCardProps {
  /** Subtopic to show. */
  subtopic: StudentSubtopic;
  /** Called when the student wants to practice the subtopic. */
  onPractice: (subtopicId: string) => void;
}

/**
 * Shows the mastery level, description and status of a subtopic and emits when the student practices it.
 *
 * @remarks
 * Low mastery is flagged for urgent reinforcement and gets a filled button; a subtopic not started yet shows `Comenzar`.
 */
export function SubtopicCard({ subtopic, onPractice }: SubtopicCardProps) {
  const tone = masteryTone(subtopic.mastery);
  const isLow = tone === 'danger';
  const isNew = subtopic.mastery === null;
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titles}>
          <View style={styles.chips}>
            <Chip
              label={`${LEVEL[tone]} (${subtopic.mastery ?? 0}%)`}
              tone={tone}
              icon={isLow ? 'error' : isNew ? 'radio_button_unchecked' : 'check_circle'}
            />
            {isLow ? (
              <View style={styles.urgent}>
                <Text variant="labelS" color="onPrimary">
                  Reforzar urgente
                </Text>
              </View>
            ) : (
              <Text variant="labelS" color="secondary">
                Tema {String(subtopic.order).padStart(2, '0')}
              </Text>
            )}
          </View>
          <Text variant="title" isHeading>
            {subtopic.name}
          </Text>
        </View>
        <IconBox icon={subtopic.icon} tone={tone === 'neutral' ? 'neutral' : tone} size="md" />
      </View>
      <Text color="secondary">{subtopic.description}</Text>
      <View style={styles.footer}>
        <View style={styles.note}>
          <View style={[styles.dot, { backgroundColor: DOT[tone] }]} />
          <Text variant="labelS" style={isLow && styles.dangerText}>
            {subtopic.note}
          </Text>
        </View>
        <Button
          label={isNew ? 'Comenzar' : 'Practicar'}
          size="sm"
          icon={isNew ? 'play_arrow' : 'arrow_forward'}
          variant={isLow || isNew ? 'primary' : 'tonal'}
          onPress={() => onPractice(subtopic.id)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg },
  titles: { flex: 1, gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md },
  urgent: { paddingHorizontal: spacing.md, paddingVertical: spacing.xxs, borderRadius: radius.full, backgroundColor: colors.danger },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  note: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  dot: { width: 6, height: 6, borderRadius: radius.full },
  dangerText: { color: colors.danger },
});
