/**
 * Academic preference row composed from icon and switch primitives.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconBox, Text, Toggle } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
/** Props accepted by {@link PreferenceRow}. */
export interface PreferenceRowProps {
  /** Name of the setting. */
  title: string;
  /** Description reflecting the current state. */
  description: string;
  /** Material Symbols icon. */
  icon: IconName;
  /**
   * Icon color family.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
  /** Current preference value. */
  value: boolean;
  /**
   * Blocks interaction while saving.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** Reports the next preference value. */
  onValueChange: (value: boolean) => void;
}
/** Displays a preference label, state description and controlled toggle. */
export function PreferenceRow({ title, description, icon, tone = 'primary', value, disabled = false, onValueChange }: PreferenceRowProps) {
  return <View style={styles.row}><IconBox icon={icon} tone={tone} size="md" variant="soft" /><View style={styles.copy}><Text variant="labelL">{title}</Text><Text variant="bodyM" color="secondary">{description}</Text></View><Toggle label={title} value={value} disabled={disabled} onValueChange={onValueChange} /></View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, copy: { flex: 1, minWidth: 0 } });
