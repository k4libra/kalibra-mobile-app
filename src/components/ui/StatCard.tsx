/**
 * Compact statistic tile for academic summary cards.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';
const COLOR: Record<Tone, string> = { primary: colors.primary, success: colors.secondaryStrong, warning: colors.tertiaryContainer, danger: colors.danger, neutral: colors.contentMuted };
/** Props accepted by {@link StatCard}. */
export interface StatCardProps {
  /** Formatted statistic. */
  value: string;
  /** Meaning of the statistic. */
  label: string;
  /** Icon above the value. */
  icon: IconName;
  /**
   * Color family of the icon.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
}
/**
 * Renders an equal-width statistic with an icon, value and wrapped label.
 * @example
 * ```tsx
 * <StatCard value="77" label="Ejercicios resueltos" icon="check_circle" />
 * ```
 */
export function StatCard({ value, label, icon, tone = 'primary' }: StatCardProps) {
  return <View style={styles.tile}><Icon name={icon} size="lg" color={COLOR[tone]} /><Text variant="headlineM">{value}</Text><Text variant="labelM" color="secondary" style={styles.label}>{label}</Text></View>;
}
const styles = StyleSheet.create({ tile: { flex: 1, minWidth: 0, paddingHorizontal: spacing.xs, paddingVertical: spacing.md, backgroundColor: colors.primarySubtle, borderRadius: radius.md, alignItems: 'center', gap: spacing.xxs }, label: { textAlign: 'center' } });
