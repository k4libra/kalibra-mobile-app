import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
import { IconBox } from './IconBox';
import { Icon } from './Icon';
import { Text } from './Text';
import { Toggle } from './Toggle';
export interface ListRowProps { title: string; description?: string; icon: IconName; tone?: Tone; onPress?: () => void; value?: boolean; onValueChange?: (value: boolean) => void; disabled?: boolean }
export function ListRow({ title, description, icon, tone = 'primary', onPress, value, onValueChange, disabled }: ListRowProps) {
  const content = <><IconBox icon={icon} tone={tone} size="md" /><View style={styles.copy}>
    <Text variant="title" color={tone === 'danger' ? 'danger' : 'primary'}>{title}</Text>
    {description && <Text variant="bodyM" color="secondary">{description}</Text>}</View>
    {onValueChange ? <Toggle label={title} value={Boolean(value)} onValueChange={onValueChange} disabled={disabled} />
      : <View style={styles.chevron}><Icon name="chevron_right" color={tone === 'danger' ? colors.danger : colors.contentSecondary} /></View>}</>;
  return onPress ? <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} disabled={disabled} style={styles.row}>{content}</Pressable> : <View style={styles.row}>{content}</View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  copy: { flex: 1, gap: 2 }, chevron: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySubtle } });
