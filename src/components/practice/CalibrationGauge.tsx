/**
 * Adaptive calibration dial and level pill.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme/tokens';
import type { CalibrationState } from '@/types/calibration';

/** SVG geometry from the Figma CalibrationGauge component (486:3480). */
const DIAL_WIDTH = 220;
const DIAL_HEIGHT = 124;
const DIAL_CENTER = 110;
const BAND_RADIUS = 86;
const NEEDLE_LENGTH = 66;
const BAND_WIDTH = 16;
const NEEDLE_WIDTH = 6;
const HUB_RADIUS = 11;
const HUB_INNER_RADIUS = 4.5;

const LEVELS = {
  calibrating: { label: 'Calibrando', angle: 90 },
  low: { label: 'Nivel básico', angle: 144 },
  medium: { label: 'Nivel intermedio', angle: 81 },
  high: { label: 'Nivel avanzado', angle: 27 },
};
const BANDS = [
  { state: 'low', start: 180, end: 109.5, color: colors.danger },
  { state: 'medium', start: 106.5, end: 55.5, color: colors.tertiary },
  { state: 'high', start: 52.5, end: 0, color: colors.secondaryStrong },
] as const;

/** Props of the calibration dial and its text-only level pill. */
export interface CalibrationGaugeProps {
  /** Calibrating sweeps; a known level settles the needle. */
  state: CalibrationState;
  /** Exact measured mastery, from 0 to 100, when available. */
  mastery?: number;
  /** Visible screen caption announced by the progress bar; defaults to the pill text. */
  caption?: string;
}

/** Draws the approved three-band dial with native needle motion and a static accessible fallback. */
export function CalibrationGauge({ state, mastery, caption }: CalibrationGaugeProps) {
  const reduced = useReducedMotion();
  const level = LEVELS[state];
  const target = state !== 'calibrating' && mastery !== undefined && Number.isFinite(mastery)
    ? 180 - Math.max(0, Math.min(100, mastery)) * 1.8 : level.angle;
  const angle = useRef(new Animated.Value(target)).current;

  useEffect(() => {
    if (reduced !== false) {
      angle.setValue(target);
      return undefined;
    }
    const timing = (toValue: number, duration: number) => Animated.timing(angle, {
      toValue, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true,
    });
    if (state === 'calibrating') angle.setValue(125);
    const animation = state === 'calibrating'
      ? Animated.loop(Animated.sequence([timing(55, 600), timing(125, 600)]))
      : timing(target, 400);
    animation.start();
    return () => { animation.stop(); angle.stopAnimation(); };
  }, [angle, reduced, state, target]);

  return <View accessible accessibilityRole="progressbar" accessibilityLabel={caption || level.label}
    accessibilityValue={state === 'calibrating' ? undefined : mastery === undefined ? { text: level.label } : { min: 0, max: 100, now: Math.max(0, Math.min(100, mastery)) }}
    style={styles.gauge}>
    <View style={styles.dial} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={DIAL_WIDTH} height={DIAL_HEIGHT} viewBox={`0 0 ${DIAL_WIDTH} ${DIAL_HEIGHT}`}>
        {BANDS.map(band => <Path key={band.state} d={arc(band.start, band.end)} fill={colors.transparent}
          stroke={band.color} strokeWidth={BAND_WIDTH} strokeLinecap="butt" opacity={state === 'calibrating' ? 0.35 : state === band.state ? 1 : 0.22} />)}
      </Svg>
      <Animated.View testID="calibration-needle" style={[styles.needle, { transform: [{ rotate: reduced !== false ? `${-target}deg` : angle.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '-180deg'] }) }] }]}>
        <Svg width={DIAL_WIDTH} height={DIAL_WIDTH}><Line x1={DIAL_CENTER} y1={DIAL_CENTER} x2={DIAL_CENTER + NEEDLE_LENGTH} y2={DIAL_CENTER} stroke={colors.contentPrimary} strokeWidth={NEEDLE_WIDTH} strokeLinecap="round" /></Svg>
      </Animated.View>
      <Svg width={DIAL_WIDTH} height={DIAL_HEIGHT} style={styles.hub}>
        <Circle cx={DIAL_CENTER} cy={DIAL_CENTER} r={HUB_RADIUS} fill={colors.contentPrimary} />
        <Circle cx={DIAL_CENTER} cy={DIAL_CENTER} r={HUB_INNER_RADIUS} fill={colors.white} />
      </Svg>
    </View>
    <View style={[styles.pill, PILL_STYLES[state].container]}><Text variant="labelL" style={PILL_STYLES[state].text}>{level.label}</Text></View>
  </View>;
}

/** Builds an upper semicircle segment in the dial's 220 × 124 viewport. */
function arc(start: number, end: number): string {
  const point = (degrees: number) => `${DIAL_CENTER + BAND_RADIUS * Math.cos(degrees * Math.PI / 180)} ${DIAL_CENTER - BAND_RADIUS * Math.sin(degrees * Math.PI / 180)}`;
  return `M ${point(start)} A ${BAND_RADIUS} ${BAND_RADIUS} 0 0 1 ${point(end)}`;
}

const styles = StyleSheet.create({
  gauge: { alignItems: 'center', gap: spacing.lg },
  dial: { width: DIAL_WIDTH, height: DIAL_HEIGHT, overflow: 'hidden' },
  needle: { position: 'absolute', top: 0, left: 0, width: DIAL_WIDTH, height: DIAL_WIDTH },
  hub: { position: 'absolute', top: 0, left: 0 },
  pill: { borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: spacing.sm },
  pillCalibrating: { backgroundColor: colors.primaryPale },
  pillLow: { backgroundColor: colors.dangerContainer },
  pillMedium: { backgroundColor: colors.tertiaryContainer },
  pillHigh: { backgroundColor: colors.secondaryContainer },
  pillTextCalibrating: { color: colors.primary },
  pillTextLow: { color: colors.dangerStrong },
  pillTextMedium: { color: colors.tertiaryStrong },
  pillTextHigh: { color: colors.secondaryStrong },
});

const PILL_STYLES = {
  calibrating: { container: styles.pillCalibrating, text: styles.pillTextCalibrating },
  low: { container: styles.pillLow, text: styles.pillTextLow },
  medium: { container: styles.pillMedium, text: styles.pillTextMedium },
  high: { container: styles.pillHigh, text: styles.pillTextHigh },
};
