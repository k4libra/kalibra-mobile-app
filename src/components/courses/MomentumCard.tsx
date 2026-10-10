/**
 * Highlight card with the practice summary of the student.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, gradients, radius, shadows, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link MomentumCard}.
 */
export interface MomentumCardProps {
  /** Exercises solved across every course. */
  solvedExerciseCount: number;
  /** Average mastery across every course, from 0 to 100. */
  averageMastery: number;
}

/**
 * Shows how many exercises the student has solved and their average mastery.
 */
export function MomentumCard({ solvedExerciseCount, averageMastery }: MomentumCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Icon name="local_fire_department" size="xs" color={colors.tertiaryPale} />
        <Text variant="labelS" style={styles.badgeText}>
          MOMENTO ACTIVO
        </Text>
      </View>
      <View style={styles.row}>
        <Text variant="display" color="onPrimary">
          {solvedExerciseCount}
        </Text>
        <Text variant="title" style={styles.light}>
          ejercicios resueltos
        </Text>
      </View>
      <Text variant="bodyM" style={styles.pale}>
        {averageMastery} % de dominio promedio
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.xl, borderRadius: radius.md, overflow: 'hidden', experimental_backgroundImage: gradients.primary, ...shadows.floating },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xxs, borderRadius: radius.full, backgroundColor: colors.overlay },
  badgeText: { color: colors.tertiaryPale },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxl },
  light: { color: colors.primaryPaleSoft },
  pale: { color: colors.primaryPale },
});
