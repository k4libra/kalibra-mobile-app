/**
 * Semantic callout primitive for notices and compact supporting content.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle, type TextStyle } from 'react-native';
import { colors, radius, spacing, TOUCH_TARGET } from '@/theme/tokens';
import type { CalloutVariant, IconName, Tone } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';
const TONE: Record<Tone, { background: string; content: string }> = {
  primary: { background: colors.primaryContainerSoft, content: colors.primaryStrong },
  success: { background: colors.secondaryContainer, content: colors.secondaryStrong },
  warning: { background: colors.tertiaryPale, content: colors.tertiaryStrong },
  danger: { background: colors.dangerContainer, content: colors.dangerStrong },
  neutral: { background: colors.primarySubtle, content: colors.contentSecondary },
};
const BACKGROUND: Record<Tone, ViewStyle> = Object.fromEntries(Object.entries(TONE).map(([tone, palette]) => [tone, { backgroundColor: palette.background }])) as Record<Tone, ViewStyle>;
const CONTENT: Record<Tone, TextStyle> = Object.fromEntries(Object.entries(TONE).map(([tone, palette]) => [tone, { color: palette.content }])) as Record<Tone, TextStyle>;
const VARIANT: Record<CalloutVariant, ViewStyle> = {
  card: { padding: spacing.xl, borderRadius: radius.lg, gap: spacing.md },
  inline: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.sm, gap: spacing.sm },
};
/** Props accepted by {@link Callout}. */
export interface CalloutProps {
  /** Optional headline. */
  title?: string;
  /** Supporting content, allowed to wrap. */
  description: string;
  /** Icon representing the notice. */
  icon?: IconName;
  /** Optional separate icon color family. */
  iconTone?: Tone;
  /**
   * Semantic color family.
   *
   * @defaultValue `'primary'`
   */
  tone?: Tone;
  /**
   * Spacing preset.
   *
   * @defaultValue `'card'`
   */
  variant?: CalloutVariant;
  /** Removes the notice when supplied. */
  onDismiss?: () => void;
  /**
   * Accessible name of the dismiss action.
   *
   * @defaultValue `'Descartar aviso'`
   */
  dismissLabel?: string;
}
/**
 * Renders a semantic message with optional heading, icon and dismiss action.
 * @example
 * ```tsx
 * <Callout tone="danger" title="Credenciales incorrectas" description={message} onDismiss={dismiss} />
 * ```
 */
export function Callout({ title, description, icon, iconTone, tone = 'primary', variant = 'card', onDismiss, dismissLabel = 'Descartar aviso' }: CalloutProps) {
  const palette = TONE[tone];
  return <View accessibilityRole={tone === 'danger' ? 'alert' : undefined} style={[styles.row, VARIANT[variant], BACKGROUND[tone]]}>
    {icon && <Icon name={icon} size={variant === 'inline' ? 'xs' : '2xl'} color={TONE[iconTone ?? tone].content} />}
    <View style={styles.copy}>{title && <Text variant={variant === 'inline' ? 'bodyMBold' : 'labelL'} style={tone === 'primary' ? styles.primaryTitle : CONTENT[tone]}>{title}</Text>}
      <Text variant="bodyM" style={tone === 'primary' ? styles.primaryDescription : CONTENT[tone]}>{description}</Text></View>
    {onDismiss && <Pressable accessibilityRole="button" accessibilityLabel={dismissLabel} onPress={onDismiss} style={styles.dismiss}><Icon name="close" color={palette.content} /></Pressable>}
  </View>;
}
const styles = StyleSheet.create({ primaryTitle: { color: colors.contentPrimary }, primaryDescription: { color: colors.contentSecondary }, row: { flexDirection: 'row', alignItems: 'center' }, copy: { flex: 1, gap: spacing.xs }, dismiss: { width: TOUCH_TARGET, height: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', marginRight: -spacing.md, alignSelf: 'flex-start' } });
