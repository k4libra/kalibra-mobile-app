/**
 * Text primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, Text as NativeText, type StyleProp, type TextStyle } from 'react-native';
import { colors, typography } from '@/theme/tokens';

/**
 * Text styles available, named after the `Kalibra/*` text styles.
 */
export type TextVariant = keyof typeof typography;

/**
 * Text colors available.
 */
export type TextColor = 'primary' | 'secondary' | 'muted' | 'onPrimary' | 'brand' | 'success' | 'warning' | 'danger';

// Color of each text color option.
const COLOR: Record<TextColor, string> = {
  primary: colors.contentPrimary,
  secondary: colors.contentSecondary,
  muted: colors.contentMuted,
  onPrimary: colors.contentOnPrimary,
  brand: colors.primaryStrong,
  success: colors.secondaryText,
  warning: colors.tertiaryStrong,
  danger: colors.dangerStrong,
};

/**
 * Props accepted by {@link Text}.
 */
export interface TextProps {
  /** Content of the text. */
  children: React.ReactNode;
  /**
   * Text style.
   *
   * @defaultValue `'bodyL'`
   */
  variant?: TextVariant;
  /**
   * Text color.
   *
   * @defaultValue `'primary'`
   */
  color?: TextColor;
  /** Maximum number of lines before truncating. */
  numberOfLines?: number;
  /** Marks the text as a heading for screen readers. */
  isHeading?: boolean;
  /** Layout adjustments from the parent (alignment, margins). */
  style?: StyleProp<TextStyle>;
}

/**
 * Renders text with one of the design-system text styles.
 *
 * @example
 * ```tsx
 * <Text variant="headlineL">Hola, Valentina</Text>
 * ```
 */
export function Text({ children, variant = 'bodyL', color = 'primary', numberOfLines, isHeading = false, style }: TextProps) {
  return (
    <NativeText
      accessibilityRole={isHeading ? 'header' : undefined}
      numberOfLines={numberOfLines}
      style={[styles.base, typography[variant], { color: COLOR[color] }, style]}
    >
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
