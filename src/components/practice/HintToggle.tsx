import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, IconBox, Text } from '@/components/ui';
import { colors } from '@/theme/tokens';
export interface HintToggleProps { hint: string }
export function HintToggle({ hint }: HintToggleProps) {
  const [isOpen, setOpen] = useState(false);
  return <View style={styles.box}><Pressable accessibilityRole="button" accessibilityLabel="¿Necesitas una pista?" accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(value => !value)} style={styles.row}>
    <IconBox icon="lightbulb" tone="warning" size="md" /><Text variant="labelL" style={styles.flex}>¿Necesitas una pista?</Text>
    <View style={styles.chevron}><Icon name={isOpen ? 'expand_less' : 'chevron_right'} color={colors.contentSecondary} /></View>
  </Pressable>{isOpen && <Text variant="bodyM" color="secondary" style={styles.hint}>{hint}</Text>}</View>;
}
const styles = StyleSheet.create({ box: { borderRadius: 20, backgroundColor: colors.white }, row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }, flex: { flex: 1 },
  chevron: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' }, hint: { paddingHorizontal: 16, paddingBottom: 16 } });
