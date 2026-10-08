/**
 * Progress bar primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import type { Tone } from '@/types/ui';

// Fill color of each tone.
const TONE: Record<Tone, string> = {
  primary: colors.primary,
  success: colors.secondaryStrong,
  warning: colors.tertiaryStrong,
  danger: colors.danger,
  neutral: colors.primaryPale,
};

/**
 * Props accepted by {@link ProgressBar}.
 */
export interface ProgressBarProps {
  /** Filled percentage from 0 to 100; `null` draws an empty track. */
  value: number | null;
  /** Accessible description of what the bar measures. */
  label: string;
  /**
   * Fill color.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
  /**
   * Track thickness in points.
   *
   * @defaultValue `8`
   */
  height?: 6 | 8 | 10;
}

/**
 * Renders a rounded track filled up to a percentage.
 *
 * @example
 * ```tsx
 * <ProgressBar value={68} label="Course progress" />
 * ```
 */
export function ProgressBar({ value, label, tone = 'primary', height = 8 }: ProgressBarProps) {
  const width = value === null ? 0 : Math.min(100, Math.max(0, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: value ?? undefined }}
      style={[styles.track, { height }]}
    >
      <View style={[styles.fill, { width: `${width}%`, backgroundColor: TONE[tone] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', borderRadius: radius.full, backgroundColor: colors.primaryContainerSoft },
  fill: { height: '100%', borderRadius: radius.full },
});
