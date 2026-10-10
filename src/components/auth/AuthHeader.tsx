/**
 * Account access headings composed from shared brand and badge primitives.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BrandMark } from '@/components/layout';
import { Chip, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';
/** Props accepted by {@link AuthHeader}. */
export interface AuthHeaderProps {
  /** Main account access heading. */
  title: string;
  /** Description under the heading. */
  subtitle: string;
  /**
   * Registration uses a portal hero instead of the sign-in brand row.
   *
   * @defaultValue `false`
   */
  isRegistration?: boolean;
}
/** Shows the account access hero and its academic network badge. */
export function AuthHeader({ title, subtitle, isRegistration = false }: AuthHeaderProps) {
  return isRegistration ? <View style={styles.hero}>
    <View style={styles.row}><BrandMark /><View style={styles.copy}><Text variant="labelM" color="brand">PORTAL ACADÉMICO</Text><Text variant="headlineL" isHeading>{title}</Text></View></View>
    <Text color="secondary">{subtitle}</Text>
    <Chip label="Acceso para +50 universidades asociadas" tone="success" icon="verified" />
  </View> : <View style={styles.signIn}>
    <View style={styles.brandRow}><View style={styles.row}><BrandMark /><Text variant="headlineL">Kalibra</Text></View><Chip label="Red Universitaria Activa" icon="fiber_manual_record" /></View>
    <View><Text variant="display" isHeading>{title}</Text><Text color="secondary">{subtitle}</Text></View>
  </View>;
}
const styles = StyleSheet.create({ hero: { padding: spacing.xl, paddingVertical: spacing.xxl, borderRadius: radius.lg, backgroundColor: colors.primarySubtle, gap: spacing.sm }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, copy: { flex: 1, gap: spacing.xs }, brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }, signIn: { gap: spacing.xxl } });
