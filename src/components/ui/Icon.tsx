/**
 * Icon primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import type { IconName } from '@/types/ui';

/**
 * Optical sizes of an icon, in points: `xs` 14, `sm` 16, `md` 18, `lg` 20, `xl` 22, `2xl` 28.
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Point size of each preset.
const SIZE: Record<IconSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22, '2xl': 28 };

/**
 * Props accepted by {@link Icon}.
 */
export interface IconProps {
  /** Material Symbols ligature to draw. */
  name: IconName;
  /**
   * Optical size of the glyph.
   *
   * @defaultValue `'md'`
   */
  size?: IconSize;
  /**
   * Color of the glyph.
   *
   * @defaultValue the primary color of the design system
   */
  color?: string;
  /** Accessible name; when omitted the icon is decorative. */
  label?: string;
  /** Layout adjustments from the parent. */
  style?: StyleProp<TextStyle>;
}

/**
 * Renders a Material Symbols Rounded glyph through its ligature.
 *
 * @example
 * ```tsx
 * <Icon name="school" size="lg" />
 * ```
 */
export function Icon({ name, size = 'md', color = colors.primary, label, style }: IconProps) {
  const dimension = SIZE[size];
  return (
    <Text
      accessible={Boolean(label)}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
      allowFontScaling={false}
      style={[styles.icon, { fontSize: dimension, lineHeight: dimension, width: dimension, height: dimension, color }, style]}
    >
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: { fontFamily: fonts.icons, textAlign: 'center', includeFontPadding: false },
});
