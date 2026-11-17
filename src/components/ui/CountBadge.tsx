import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';
import { Text } from './Text';
export function CountBadge({ count }: { count: number }) {
  return <View accessibilityLabel={`${count} invitaciones pendientes`} style={styles.badge}>
    <Text variant="labelS" color="onPrimary">{count}</Text>
  </View>;
}
const styles = StyleSheet.create({ badge: { height: 18, minWidth: 18, paddingHorizontal: 5,
  borderRadius: 9999, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white,
  alignItems: 'center', justifyContent: 'center' } });
