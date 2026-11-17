/**
 * Shortcut to a short mixed practice session.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, radius } from '@/theme/tokens';

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
        <Icon name="bolt" size="xl" color={colors.tertiaryStrong} />
      </View>
      <View style={styles.text}>
        <Text variant="title">Práctica exprés</Text>
        <Text variant="bodyM" color="secondary">
          5 problemas rápidos mixtos
        </Text>
      </View>
      <View style={styles.go}>
        <Icon name="chevron_right" size="lg" color={colors.primaryStrong} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.xxl, backgroundColor: colors.tertiarySubtle },
  icon: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.surfaceBorder },
  text: { flex: 1 },
  go: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySubtle },
});
