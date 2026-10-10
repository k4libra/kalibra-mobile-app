/**
 * Urgent reinforcement card of the progress tab.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';
import type { FocusRecommendation } from '@/types/progress';

/**
 * Props accepted by {@link FocusCard}.
 */
export interface FocusCardProps {
  /** Subtopic to reinforce and suggested practice. */
  focus: FocusRecommendation;
  /** Called with the subtopic when the student starts reinforcing it. */
  onReinforce: (subtopicId: string) => void;
}

/**
 * Highlights the weakest subtopic and emits when the student chooses to reinforce it.
 */
export function FocusCard({ focus, onReinforce }: FocusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.badge}>
          <Icon name="priority_high" size="xl" color={colors.white} />
        </View>
        <View style={styles.flex}>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text variant="labelS" color="warning">
                FOCO URGENTE
              </Text>
            </View>
            <Text variant="labelM" color="warning">
              {focus.mastery}% dominio
            </Text>
          </View>
          <Text variant="headlineM" color="warning">
            {focus.subtopicName}
          </Text>
          <Text variant="bodyM" color="warning">
            {focus.message}
          </Text>
        </View>
      </View>
      <Button label="Reforzar ahora" icon="arrow_forward" onPress={() => onReinforce(focus.subtopicId)} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xl, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.tertiaryPale },
  row: { flexDirection: 'row', gap: spacing.lg },
  badge: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tertiaryStrong },
  flex: { flex: 1, gap: spacing.xs },
  tags: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.xxs, borderRadius: radius.sm, backgroundColor: colors.tertiaryContainer },
  button: { backgroundColor: colors.tertiaryStrong },
});
