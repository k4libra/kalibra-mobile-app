/**
 * Card primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link Card}.
 */
export interface CardProps {
  /** Content of the card. */
  children: React.ReactNode;
  /** Layout adjustments from the parent (gap, padding overrides, margins). */
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a white, rounded surface with the card elevation and 16 pt padding.
 *
 * @example
 * ```tsx
 * <Card><Text>...</Text></Card>
 * ```
 */
export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surfaceCard, borderRadius: radius.lg, padding: spacing.xl, ...shadows.card },
});
