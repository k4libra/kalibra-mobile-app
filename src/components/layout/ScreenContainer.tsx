import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundGlow } from '@/components/ui';
import { colors } from '@/theme/tokens';
export interface ScreenContainerProps {
  header: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode;
  variant?: 'default' | 'profile' | 'practice' | 'invitations' | 'courses'; onRefresh?: () => void; refreshing?: boolean;
}
export function ScreenContainer({ header, children, footer, onRefresh, refreshing = false, variant = 'default' }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  return <View style={styles.screen}><BackgroundGlow />{header}
    <ScrollView contentContainerStyle={[styles.content, (variant === 'profile' || variant === 'invitations' || variant === 'courses') && styles.profile, variant === 'practice' && styles.practice]} showsVerticalScrollIndicator={false}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined}>
      {children}
    </ScrollView>
    {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>{footer}</View>}
  </View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surfaceBackground },
  content: { gap: 18, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 112, maxWidth: 600, width: '100%', alignSelf: 'center' },
  profile: { gap: 20 },
  practice: { gap: 16 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingTop: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: 'rgba(255,255,255,0.96)' } });
