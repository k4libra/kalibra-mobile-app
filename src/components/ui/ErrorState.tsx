/**
 * Error message primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * Props accepted by {@link ErrorState}.
 */
export interface ErrorStateProps {
  /** Message to show. */
  message: string;
}

/**
 * Renders a red message box when the data of a screen cannot be loaded.
 *
 * @example
 * ```tsx
 * {error && <ErrorState message={error} />}
 * ```
 */
export function ErrorState({ message }: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" style={styles.box}>
      <Icon name="error" color={colors.dangerStrong} />
      <Text variant="bodyM" color="danger" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.sm, backgroundColor: colors.dangerContainer },
  text: { flex: 1 },
});
