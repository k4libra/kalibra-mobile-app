/**
 * Shortcut to a short mixed practice session.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link QuickPracticeCard}.
 */
export interface QuickPracticeCardProps {
  /** Called when the student starts the quick practice. */
  onPress: () => void;
}

/**
 * Renders the quick practice shortcut and emits when the student starts it.
 */
export function QuickPracticeCard({ onPress }: QuickPracticeCardProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Iniciar práctica exprés" onPress={onPress} style={styles.card}>
      <View style={styles.icon}>
        <Icon name="bolt" size="lg" color={colors.primaryStrong} />
      </View>
      <View style={styles.text}>
        <Text variant="labelL">Práctica exprés</Text>
        <Text variant="bodyM" color="secondary">
          5 problemas rápidos mixtos
        </Text>
      </View>
      <View style={styles.go}>
        <Icon name="play_arrow" size="lg" color={colors.primaryStrong} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl, borderRadius: radius.md, backgroundColor: colors.primarySubtle },
  icon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer },
  text: { flex: 1 },
  go: { width: 36, height: 36, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceCard },
});
