/**
 * Icon container primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
import { Icon, type IconSize } from './Icon';

/**
 * Box presets: `sm` 32 pt, `md` 40 pt, `lg` 48 pt and `xl` 64 pt.
 */
export type IconBoxSize = 'sm' | 'md' | 'lg' | 'xl';

// Background and glyph color of each tone.
const TONE: Record<Tone, { background: string; content: string }> = {
  primary: { background: colors.primaryContainer, content: colors.primaryStrong },
  success: { background: colors.secondaryContainer, content: colors.secondaryStrong },
  warning: { background: colors.tertiaryPale, content: colors.tertiaryStrong },
  danger: { background: colors.dangerContainer, content: colors.dangerStrong },
  neutral: { background: colors.primarySubtle, content: colors.contentSecondary },
};

// Dimension, radius and glyph size of each preset.
const SIZE: Record<IconBoxSize, { box: number; radius: number; icon: IconSize }> = {
  sm: { box: 32, radius: radius.sm, icon: 'md' },
  md: { box: 40, radius: radius.md, icon: 'lg' },
  lg: { box: 48, radius: radius.md, icon: 'xl' },
  xl: { box: 64, radius: radius.full, icon: '2xl' },
};

/**
 * Props accepted by {@link IconBox}.
 */
export interface IconBoxProps {
  /** Icon drawn in the center. */
  icon: IconName;
  /**
   * Color family of the box.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
  /**
   * Box dimension.
   *
   * @defaultValue `'lg'`
   */
  size?: IconBoxSize;
  /** Layout adjustments from the parent. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders an icon inside a rounded, tinted square used by cards and dialogs.
 *
 * @example
 * ```tsx
 * <IconBox icon="account_tree" tone="warning" />
 * ```
 */
export function IconBox({ icon, tone = 'primary', size = 'lg', style }: IconBoxProps) {
  const preset = SIZE[size];
  const palette = TONE[tone];
  return (
    <View
      style={[
        styles.box,
        { width: preset.box, height: preset.box, borderRadius: preset.radius, backgroundColor: palette.background },
        style,
      ]}
    >
      <Icon name={icon} size={preset.icon} color={palette.content} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
