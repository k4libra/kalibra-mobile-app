/**
 * Circular progress primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import type { Tone } from '@/types/ui';

// Arc color of each tone.
const TONE: Record<Tone, string> = {
  primary: colors.primary,
  success: colors.secondaryStrong,
  warning: colors.tertiary,
  danger: colors.danger,
  neutral: colors.primaryPale,
};

/**
 * Props accepted by {@link MasteryRing}.
 */
export interface MasteryRingProps {
  /** Filled percentage from 0 to 100; `null` draws an empty track. */
  value: number | null;
  /** Accessible description of what the ring measures. */
  label: string;
  /**
   * Arc color.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
  /**
   * Outer diameter in points.
   *
   * @defaultValue `104`
   */
  size?: number;
  /**
   * Ring thickness in points.
   *
   * @defaultValue `10`
   */
  thickness?: number;
  /** Content centered inside the ring, usually the percentage. */
  children?: React.ReactNode;
}

/**
 * Renders a ring filled clockwise from the top up to a percentage.
 *
 * @remarks
 * Each half of the circle is clipped and swept by a rotated half-disc, so 0, 50 and 100 render exactly.
 *
 * @example
 * ```tsx
 * <MasteryRing value={62} label="Global mastery"><Text>62%</Text></MasteryRing>
 * ```
 */
export function MasteryRing({ value, label, tone = 'primary', size = 104, thickness = 10, children }: MasteryRingProps) {
  const percent = value === null ? 0 : Math.min(100, Math.max(0, value));
  const angle = percent * 3.6;
  const half = size / 2;
  const color = TONE[tone];
  const disc = { width: half, height: size, backgroundColor: color };
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: value ?? undefined }}
      style={[styles.track, { width: size, height: size, borderRadius: half }]}
    >
      <View style={[styles.clip, { left: half, width: half, height: size }]}>
        <View style={[styles.sweep, { left: -half, width: size, height: size, transform: [{ rotate: `${Math.min(angle, 180)}deg` }] }]}>
          {percent > 0 && <View style={[disc, { borderTopLeftRadius: half, borderBottomLeftRadius: half }]} />}
        </View>
      </View>
      <View style={[styles.clip, { left: 0, width: half, height: size }]}>
        <View style={[styles.sweep, { left: 0, width: size, height: size, transform: [{ rotate: `${Math.max(angle - 180, 0)}deg` }] }]}>
          {percent > 50 && <View style={[disc, { left: half, borderTopRightRadius: half, borderBottomRightRadius: half }]} />}
        </View>
      </View>
      <View style={[styles.hole, { width: size - thickness * 2, height: size - thickness * 2, borderRadius: half }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.primaryContainer },
  clip: { position: 'absolute', top: 0, overflow: 'hidden' },
  sweep: { position: 'absolute', top: 0 },
  hole: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceCard, borderRadius: radius.full },
});
