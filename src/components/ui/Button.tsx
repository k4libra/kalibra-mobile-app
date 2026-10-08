/**
 * Button primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { ButtonSize, ButtonVariant, IconName } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';

// Background and content color of each variant.
const VARIANT: Record<ButtonVariant, { background: string; content: string }> = {
  primary: { background: colors.primaryStrong, content: colors.contentOnPrimary },
  tonal: { background: colors.primaryContainer, content: colors.primaryStrong },
  neutral: { background: colors.primaryContainerSoft, content: colors.contentPrimary },
  danger: { background: colors.danger, content: colors.contentOnPrimary },
  'danger-soft': { background: colors.primarySubtle, content: colors.danger },
  ghost: { background: colors.transparent, content: colors.primaryStrong },
};

// Height and padding of each size.
const SIZE: Record<ButtonSize, ViewStyle> = {
  md: { minHeight: 52, paddingHorizontal: spacing.xxl, borderRadius: radius.md },
  sm: { minHeight: 36, paddingHorizontal: spacing.lg, borderRadius: radius.md },
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
  onPress,
  style,
}: ButtonProps) {
  const palette = VARIANT[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        SIZE[size],
        { backgroundColor: palette.background },
        variant === 'primary' && shadows.raised,
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && iconPosition === 'start' && <Icon name={icon} size="md" color={palette.content} />}
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
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dimmed: { opacity: 0.6 },
});
