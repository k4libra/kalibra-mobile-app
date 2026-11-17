/**
 * Button primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { ButtonSize, ButtonVariant, IconName } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';

// Background and content color of each variant.
const VARIANT: Record<ButtonVariant, { background: string; content: string }> = {
  primary: { background: colors.primary, content: colors.contentOnPrimary },
  tonal: { background: colors.primaryContainerSoft, content: colors.primaryStrong },
  neutral: { background: colors.primaryContainerSoft, content: colors.contentPrimary },
  danger: { background: colors.dangerContainer, content: colors.danger },
  'danger-soft': { background: colors.dangerContainer, content: colors.danger },
  ghost: { background: colors.white, content: colors.contentPrimary },
};

// Height and padding of each size.
const SIZE: Record<ButtonSize, ViewStyle> = {
  md: { minHeight: 52, paddingHorizontal: spacing.xxxl, borderRadius: radius.full },
  sm: { minHeight: 44, paddingHorizontal: spacing.xxxl, borderRadius: radius.full },
};

/**
 * Props accepted by {@link Button}.
 */
export interface ButtonProps {
  /** Text shown inside the button. */
  label: string;
  /**
   * Visual style of the button.
   *
   * @defaultValue `'primary'`
   */
  variant?: ButtonVariant;
  /**
   * Height and padding preset: `md` 52 pt and `sm` 36 pt.
   *
   * @defaultValue `'md'`
   */
  size?: ButtonSize;
  /** Icon rendered next to the label. */
  icon?: IconName;
  /**
   * Side of the label where the icon goes.
   *
   * @defaultValue `'end'`
   */
  iconPosition?: 'start' | 'end';
  /**
   * Blocks interaction and dims the button.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Shows an activity indicator and blocks interaction.
   *
   * @defaultValue `false`
   */
  loading?: boolean;
  /** Called when the user taps the button. */
  onPress?: () => void;
  /** Layout adjustments from the parent (width, margins, flex). */
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders the call-to-action control of the design system.
 *
 * @remarks
 * Use one `primary` button per screen or dialog. Cancel actions use `neutral`.
 *
 * @example
 * ```tsx
 * <Button label="Enviar respuesta" icon="arrow_forward" onPress={handleSubmit} />
 * ```
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  disabled = false,
  loading = false,
  onPress,
  style,
}: ButtonProps) {
  const palette = VARIANT[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        SIZE[size],
        { backgroundColor: palette.background },
        variant === 'primary' && shadows.raised,
        variant === 'ghost' && styles.border,
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading && <ActivityIndicator color={palette.content} />}
        {icon && !loading && iconPosition === 'start' && <Icon name={icon} size="md" color={palette.content} />}
        <Text variant="labelL" style={{ color: palette.content }}>
          {label}
        </Text>
        {icon && iconPosition === 'end' && <Icon name={icon} size="md" color={palette.content} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  border: { borderWidth: 1, borderColor: colors.surfaceBorder },
  dimmed: { opacity: 0.6 },
});
