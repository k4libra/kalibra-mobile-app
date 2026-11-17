import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';
import type { Tone } from '@/types/ui';
const TONE: Record<Tone, string> = { primary: colors.primary, success: colors.secondary, warning: colors.tertiary, danger: colors.danger, neutral: colors.primaryPale };
export interface MasteryRingProps { value: number | null; label: string; tone?: Tone; size?: number; thickness?: number; children?: React.ReactNode }
/** A true SVG arc leaves the interior transparent over the progress card gradient. */
export function MasteryRing({ value, label, tone = 'primary', size = 104, thickness = 10, children }: MasteryRingProps) {
  const percent = value === null ? 0 : Math.min(100, Math.max(0, value));
  const r = (size - thickness) / 2;
  const length = 2 * Math.PI * r;
  return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: value ?? undefined }} style={{ width: size, height: size }}>
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}><Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.primaryContainerSoft} strokeWidth={thickness} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={TONE[tone]} strokeWidth={thickness} fill="none" strokeDasharray={`${length} ${length}`} strokeDashoffset={length * (1 - percent / 100)} rotation="-90" origin={`${size / 2}, ${size / 2}`} />
    </Svg><View style={styles.content}>{children}</View>
  </View>;
}
const styles = StyleSheet.create({ content: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' } });
