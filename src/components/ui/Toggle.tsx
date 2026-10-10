/**
 * Controlled switch primitive with semantic accessibility.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, TOUCH_TARGET } from '@/theme/tokens';
const TRACK: Record<'on' | 'off', ViewStyle> = { on: { backgroundColor: colors.primary }, off: { backgroundColor: colors.primaryContainer } };
const THUMB: Record<'on' | 'off', ViewStyle> = { on: { alignSelf: 'flex-end' }, off: { alignSelf: 'flex-start' } };
/** Props accepted by {@link Toggle}. */
export interface ToggleProps {
  /** Accessible name of the setting. */
  label: string;
  /** Current enabled state. */
  value: boolean;
  /** Receives the next enabled state. */
  onValueChange: (value: boolean) => void;
  /**
   * Blocks interaction.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
}
/**
 * Renders a token-colored switch with a white thumb and a 44-point touch target.
 * @example
 * ```tsx
 * <Toggle label="Modo nocturno" value={enabled} onValueChange={setEnabled} />
 * ```
 */
export function Toggle({ label, value, onValueChange, disabled = false }: ToggleProps) {
  const state = value ? 'on' : 'off';
  return <Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value, disabled }} disabled={disabled}
    onPress={() => onValueChange(!value)} style={styles.target}>
    <View style={[styles.track, TRACK[state]]}><View style={[styles.thumb, THUMB[state]]} /></View>
  </Pressable>;
}
const styles = StyleSheet.create({ target: { width: 48, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' }, track: { width: 48, height: 24, borderRadius: radius.full, padding: 2 }, thumb: { width: 20, height: 20, borderRadius: radius.full, backgroundColor: colors.white } });
