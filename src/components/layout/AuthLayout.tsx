/**
 * Safe-area and keyboard-aware layout for account access screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/tokens';
const VARIANT: Record<'signIn' | 'signUp', ViewStyle> = { signIn: { justifyContent: 'center', paddingVertical: 60, gap: spacing.xxxl }, signUp: { paddingTop: 58, paddingBottom: 44, gap: spacing.xxl } };
/** Props accepted by {@link AuthLayout}. */
export interface AuthLayoutProps {
  /** Account access composition. */
  children: React.ReactNode;
  /**
   * Vertical layout preset.
   *
   * @defaultValue `'signIn'`
   */
  variant?: 'signIn' | 'signUp';
}
/**
 * Renders a fluid form column that scrolls when the keyboard or display size requires it.
 * @example
 * ```tsx
 * <AuthLayout variant="signUp">{form}</AuthLayout>
 * ```
 */
export function AuthLayout({ children, variant = 'signIn' }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();
  return <KeyboardAvoidingView style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={[styles.content, VARIANT[variant]]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surfaceBackground }, content: { flexGrow: 1, paddingHorizontal: spacing.gutter, width: '100%', maxWidth: 600, alignSelf: 'center' } });
