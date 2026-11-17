import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, shadows } from '@/theme/tokens';
import type { IconName } from '@/types/ui';
import { Icon } from './Icon';
export interface IconButtonProps { name: IconName; label: string; onPress?: () => void; tinted?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle> }
export function IconButton({ name, label, onPress, tinted = false, disabled, style }: IconButtonProps) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled}
    onPress={onPress} hitSlop={2} style={[styles.button, tinted && styles.tinted, style]}>
    <Icon name={name} size="lg" color={tinted ? colors.primary : colors.contentPrimary} />
  </Pressable>;
}
const styles = StyleSheet.create({ button: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white,
  alignItems: 'center', justifyContent: 'center', ...shadows.iconButton }, tinted: { backgroundColor: colors.primarySubtle } });
