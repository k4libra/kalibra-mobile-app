/**
 * Token-based text input with validation feedback and password visibility.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography, TOUCH_TARGET } from '@/theme/tokens';
import type { IconName, TextFieldVariant } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';

const VARIANT: Record<TextFieldVariant, ViewStyle> = { compact: { minHeight: 52 }, regular: { minHeight: 52 } };
/** Props accepted by {@link TextField}. */
export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Accessible label displayed above the field. */
  label: string;
  /** Icon displayed before the value. */
  icon?: IconName;
  /** Message displayed below the field. */
  error?: string;
  /**
   * Whether the value is invalid, even when no notice is shown below it.
   *
   * @defaultValue `false`
   */
  isInvalid?: boolean;
  /** Short label displayed opposite the field label. */
  hint?: string;
  /**
   * Inline hint uses danger styling.
   *
   * @defaultValue `false`
   */
  isHintError?: boolean;
  /**
   * Input height preset.
   *
   * @defaultValue `'regular'`
   */
  variant?: TextFieldVariant;
  /** Helper text displayed below the field. */
  helperText?: string;
  /** Helper displayed on the opposite side. */
  helperHint?: string;
}
/**
 * Renders a labelled text field with an optional eye control and inline feedback.
 * @example
 * ```tsx
 * <TextField label="Password" icon="lock" secureTextEntry value={password} onChangeText={setPassword} />
 * ```
 */
export function TextField({ label, icon, error, isInvalid = false, hint, isHintError = false, variant = 'regular', helperText, helperHint, secureTextEntry = false, editable = true, ...input }: TextFieldProps) {
  const [isVisible, setVisible] = useState(false);
  const invalid = isInvalid || Boolean(error);
  return (
    <View style={styles.field}>
      <View style={styles.labels}>
        <Text variant="labelL">{label}</Text>
        {hint && <Text variant="labelM" color={isHintError ? 'danger' : 'muted'}>{hint}</Text>}
      </View>
      <View style={[styles.inputRow, VARIANT[variant], invalid && styles.invalid]}>

        {icon && <Icon name={icon} color={invalid ? colors.danger : colors.primary} size="lg" />}
        <TextInput {...input} accessibilityLabel={label} accessibilityHint={error ?? hint} editable={editable}
          autoCapitalize={input.autoCapitalize ?? 'none'} autoCorrect={false} secureTextEntry={secureTextEntry && !isVisible}
          placeholderTextColor={colors.contentMuted} selectionColor={colors.primary} underlineColorAndroid={colors.transparent}
          hitSlop={spacing.xs} style={styles.input} />
        {secureTextEntry ? (
          <Pressable accessibilityRole="button" accessibilityLabel={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            accessibilityState={{ disabled: !editable, selected: isVisible }} disabled={!editable} hitSlop={spacing.md}
            style={styles.eye} onPress={() => setVisible(value => !value)}>
            <Icon name={isVisible ? 'visibility_off' : 'visibility'} size="lg" color={isVisible ? colors.primary : colors.contentMuted} />
          </Pressable>
        ) : invalid && <Icon name="error" size="lg" color={colors.danger} />}
      </View>
      {error && <View accessibilityRole="alert" style={styles.helper}><Icon name="error" size="xs" color={colors.danger} /><Text variant="bodyM" color="danger" style={styles.helperCopy}>{error}</Text></View>}
      {helperText && <View style={styles.labels}><View style={styles.helper}><Icon name="check_circle" size="xs" color={colors.secondaryStrong} /><Text variant="bodyM" color="secondary">{helperText}</Text></View>{helperHint && <Text variant="labelM" color="muted">{helperHint}</Text>}</View>}
    </View>
  );
}
const styles = StyleSheet.create({
  field: { gap: spacing.md }, labels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, backgroundColor: colors.surfaceCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.lineSubtle },
  invalid: { backgroundColor: colors.dangerContainer, borderColor: colors.danger, borderWidth: 1.5 },
  input: { flex: 1, minWidth: 0, paddingVertical: spacing.md, paddingHorizontal: 0, ...typography.bodyL, color: colors.contentPrimary, includeFontPadding: false },
  eye: { width: TOUCH_TARGET, height: TOUCH_TARGET, marginVertical: -spacing.xs, marginRight: -spacing.lg, justifyContent: 'center', alignItems: 'center' },
  helper: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  helperCopy: { flex: 1 },
});
