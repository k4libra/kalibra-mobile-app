/**
 * Loading state primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';
import { Text } from './Text';

/**
 * Props accepted by {@link LoadingState}.
 */
export interface LoadingStateProps {
  /**
   * Text announced while the content loads.
   *
   * @defaultValue `'Cargando…'`
   */
  label?: string;
}

/**
 * Renders a spinner while the data of a screen is loading.
 *
 * @example
 * ```tsx
 * <LoadingState />
 * ```
 */
export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text color="secondary">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.pageTop },
});
