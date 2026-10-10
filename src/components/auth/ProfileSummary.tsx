/**
 * Academic identity and statistics composed from shared primitives.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Avatar, Card, Chip, Icon, StatCard, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import type { AuthUser, ProfileStats } from '@/types/auth';
/** Props accepted by {@link ProfileSummary}. */
export interface ProfileSummaryProps {
  /** Current account identity. */
  user: AuthUser;
  /** Academic totals for this account. */
  stats: ProfileStats;
  /** Account photo when available. */
  avatar?: ImageSourcePropType;
}
/** Shows the account identity, institutional status and three academic statistics. */
export function ProfileSummary({ user, stats, avatar }: ProfileSummaryProps) {
  return <Card style={styles.card}>
    <View style={styles.identity}><Avatar name={user.fullName} source={avatar} isVerified /><View style={styles.copy}>
      <Chip label="Estudiante universitario" icon="school" tone="success" />
      <Text variant="headlineM">{user.fullName}</Text><Text variant="bodyM" color="secondary">{user.email}</Text>
      {(user.faculty || user.semester) && <View style={styles.faculty}><Icon name="account_balance" size="xs" color={colors.primaryStrong} /><Text variant="labelM" color="brand">{[user.faculty, user.semester].filter(Boolean).join(' • ')}</Text></View>}
    </View></View>
    <View style={styles.stats}><StatCard value={String(stats.solvedExerciseCount)} label="Ejercicios resueltos" icon="check_circle" /><StatCard value={`${stats.averageMastery ?? 0}%`} label="Dominio promedio" icon="local_fire_department" tone="warning" /><StatCard value={String(stats.activeCourseCount)} label="Cursos activos" icon="menu_book" tone="success" /></View>
  </Card>;
}
const styles = StyleSheet.create({ card: { gap: spacing.xl }, identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl }, copy: { flex: 1, minWidth: 0, gap: spacing.xs }, faculty: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' }, stats: { flexDirection: 'row', gap: spacing.xs } });
