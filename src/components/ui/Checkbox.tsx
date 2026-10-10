/**
 * Accessible controlled checkbox primitive.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing, TOUCH_TARGET } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';
const STATE: Record<'checked' | 'unchecked', ViewStyle> = {
  checked: { backgroundColor: colors.primaryStrong, borderColor: colors.primaryStrong },
  unchecked: { backgroundColor: colors.surfaceCard, borderColor: colors.contentMuted },
};
/** Props accepted by {@link Checkbox}. */
export interface CheckboxProps {
  /** Visible and accessible label. */
  label: string;
  /** Current checked state. */
  value: boolean;
  /** Receives the next state on activation. */
  onValueChange: (value: boolean) => void;
  /**
   * Blocks interaction.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
}
/**
 * Renders a compact checkbox with a full-size accessible touch target.
 * @example
 * ```tsx
 * <Checkbox label="Remember this device" value={remember} onValueChange={setRemember} />
 * ```
 */
export function Checkbox({ label, value, onValueChange, disabled = false }: CheckboxProps) {
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked: value, disabled }}
    disabled={disabled} onPress={() => onValueChange(!value)} style={styles.row}>
    <View style={[styles.box, STATE[value ? 'checked' : 'unchecked']]}>{value && <Icon name="check" size="xs" color={colors.white} />}</View>
    <Text variant="bodyM" color="secondary">{label}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({ row: { minHeight: TOUCH_TARGET, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, box: { width: 16, height: 16, borderWidth: 1, borderRadius: radius.sm / 4, alignItems: 'center', justifyContent: 'center' } });
