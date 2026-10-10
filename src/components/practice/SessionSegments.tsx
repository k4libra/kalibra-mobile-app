/**
 * Segmented progress of a practice session.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link SessionSegments}.
 */
export interface SessionSegmentsProps {
  /** Exercises in the session. */
  total: number;
  /** Outcome of each answered exercise in order: `true` correct, `false` wrong. */
  outcomes?: boolean[];
  /** Exercises reached so far, used when outcomes are unknown. */
  reached?: number;
}

/**
 * Renders one segment per exercise: answered ones green or red, reached ones indigo, pending ones pale.
 */
export function SessionSegments({ total, outcomes = [], reached = 0 }: SessionSegmentsProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={`Ejercicio ${Math.max(reached, outcomes.length)} de ${total}`} style={styles.row}>
      {Array.from({ length: total }, (_, index) => {
        const outcome = outcomes[index];
        const color =
          outcome === undefined ? (index < reached ? colors.primary : colors.primaryContainer) : outcome ? colors.secondaryStrong : colors.danger;
        return <View key={index} style={[styles.segment, { backgroundColor: color }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  segment: { flex: 1, height: 6, borderRadius: radius.full },
});
