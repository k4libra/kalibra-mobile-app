import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundGlow } from '@/components/ui';
import { colors } from '@/theme/tokens';
export interface AuthLayoutProps { children: React.ReactNode; variant?: 'signIn' | 'signUp' }
export function AuthLayout({ children }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><BackgroundGlow />
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 8, 56), paddingBottom: Math.max(insets.bottom, 32) }]}
      keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surfaceBackground }, content: { gap: 18, paddingHorizontal: 16, width: '100%', maxWidth: 600, alignSelf: 'center' } });
