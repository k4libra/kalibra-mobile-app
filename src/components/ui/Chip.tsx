/**
 * Chip primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';

// Background and content color of each tone.
const TONE: Record<Tone, { background: string; content: string }> = {
  primary: { background: colors.primaryContainerSoft, content: colors.primary },
  success: { background: colors.secondaryPale, content: colors.secondaryText },
  warning: { background: colors.tertiarySubtle, content: colors.tertiaryStrong },
  danger: { background: colors.dangerContainer, content: colors.dangerStrong },
  neutral: { background: colors.primarySubtle, content: colors.contentPrimary },
};

/**
 * Props accepted by {@link Chip}.
 */
export interface ChipProps {
  /** Text of the chip. */
  label: string;
  /**
   * Color family that conveys the state.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
  /** Icon rendered before the label. */
  icon?: IconName;
  /** Layout adjustments from the parent. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a compact, rounded status or count label.
 *
 * @example
 * ```tsx
 * <Chip label="Expires in 2 days" tone="warning" icon="schedule" />
 * ```
 */
export function Chip({ label, tone = 'primary', icon, style }: ChipProps) {
  const palette = TONE[tone];
  return (
    <View style={[styles.chip, { backgroundColor: palette.background }, style]}>
      {icon && <Icon name={icon} size="xs" color={palette.content} />}
      <Text variant="bodyMBold" style={{ color: palette.content }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
});
