/**
 * Exercise calibration context and loading placeholders.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';
import type { CalibrationState } from '@/types/calibration';
import { CalibrationGauge } from './CalibrationGauge';

/** Content required by the loading and selected-level exercise frames. */
export interface ExerciseCalibrationProps {
  /** Current dial state, derived from the returned exercise difficulty. */
  state: CalibrationState;
  /** Known guided subtopic, or the returned express subtopic after selection. */
  subtopic?: string;
  /** Exact mastery when known. */
  mastery?: number;
  /** Generation has exceeded six seconds. */
  isLongWait?: boolean;
}

/** Shows calibration context, the dial and noninteractive exercise placeholders. */
export function ExerciseCalibration({ state, subtopic, mastery, isLongWait = false }: ExerciseCalibrationProps) {
  const settled = state !== 'calibrating';
  const title = settled ? `Nivel ${{ low: 'básico', medium: 'intermedio', high: 'avanzado' }[state]} elegido para ti` : 'Calibrando tu ejercicio';
  const caption = settled ? subtopic && mastery !== undefined ? `Tu dominio en ${subtopic} es ${mastery} %` : undefined
    : isLongWait ? 'Creando y verificando tu ejercicio'
      : subtopic ? `Revisando tu dominio en ${subtopic}` : 'Buscando tu subtema más débil';
  return <View style={styles.stack}>
    {subtopic && <Chip label={subtopic} icon="terminal" />}
    <Card style={styles.card}>
      <CalibrationGauge state={state} mastery={mastery} caption={caption || title} />
      <Text variant="headlineM" isHeading style={styles.center}>{title}</Text>
      {caption && <Text variant="bodyL" color="secondary" style={styles.center}>{caption}</Text>}
      <Text variant="bodyM" color="secondary" style={styles.center}>{settled ? 'Si no hay uno listo, lo creamos y verificamos para ti.' : 'Elegimos el ejercicio según tu nivel actual.'}</Text>
    </Card>
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.stack, settled && styles.settled]}>
      <Card style={styles.skeletonCard}>
        <View style={[styles.skeleton, styles.icon]} />
        <View style={[styles.skeleton, styles.line, styles.longLine]} />
        <View style={[styles.skeleton, styles.line, styles.shortLine]} />
      </Card>
      <View style={styles.options}>{[0, 1, 2, 3].map(index => <View key={index} style={[styles.skeleton, styles.option]} />)}</View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xl },
  card: { borderRadius: radius.xl, alignItems: 'center', gap: spacing.lg, paddingTop: 28, paddingBottom: spacing.xxxl },
  center: { textAlign: 'center' },
  skeletonCard: { borderRadius: radius.xl, gap: spacing.lg },
  skeleton: { backgroundColor: colors.primaryPaleSoft },
  icon: { width: 40, height: 40, borderRadius: radius.md },
  line: { height: 14, borderRadius: radius.sm, maxWidth: '100%' },
  longLine: { width: 280 },
  shortLine: { width: 200 },
  options: { gap: 10 },
  option: { height: 56, borderRadius: radius.lg },
  settled: { opacity: 0.6 },
});
