import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
import { Card } from './Card';
import { IconBox } from './IconBox';
import { Text } from './Text';
export interface StatItemProps { icon: IconName; value: string | number; label: string; tone?: Tone }
export function StatItem({ icon, value, label, tone = 'primary' }: StatItemProps) {
  return <View style={styles.item}><IconBox icon={icon} tone={tone} size="md" />
    <Text variant="headlineL" style={styles.center}>{value}</Text><Text variant="bodyM" color="secondary" style={styles.center}>{label}</Text></View>;
}
export function StatStrip({ items }: { items: StatItemProps[] }) {
  return <Card style={styles.strip}>{items.map((item, i) => <React.Fragment key={item.label}>
    {i > 0 && <View style={styles.divider} />}<StatItem {...item} /></React.Fragment>)}</Card>;
}
const styles = StyleSheet.create({ strip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 12 },
  item: { flex: 1, alignItems: 'center', gap: 6 }, divider: { width: 1, height: 54, backgroundColor: colors.surfaceBorder }, center: { textAlign: 'center' } });
