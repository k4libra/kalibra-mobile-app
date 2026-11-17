import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Avatar, Chip, Icon, ProgressBar, Text } from '@/components/ui';
import { colors } from '@/theme/tokens';
import type { AuthUser, ProfileStats } from '@/types/auth';
import { masteryTone } from '@/utils/mastery';
import { currentAcademicTerm } from '@/utils/term';

export interface ProfileSummaryProps {
  user: AuthUser;
  stats: ProfileStats;
  avatar?: ImageSourcePropType;
}

/** Account identity and measured mastery; totals belong to the separate stat strip. */
export function ProfileSummary({ user, stats, avatar }: ProfileSummaryProps) {
  const mastery = stats.averageMastery;
  const level = mastery === null ? 'Sin actividad' : mastery < 40 ? 'Nivel bajo' : mastery <= 70 ? 'Nivel medio' : 'Nivel alto';
  const academicLabel = [user.faculty, user.semester, `Ciclo ${user.term?.trim() || currentAcademicTerm()}`].filter(Boolean).join(' · ');
  return (
    <View style={styles.card}>
      <View style={styles.identity}>
        <Avatar name={user.fullName} source={avatar} isVerified size={84} />
        <View style={styles.copy}>
          <Chip label="Estudiante universitario" icon="school" tone="success" />
          <Text variant="headlineM">{user.fullName}</Text>
          <Text variant="bodyM" color="secondary">{user.email}</Text>
          <View style={styles.faculty}><Icon name="account_balance" size="xs" /><Text variant="bodyMBold" color="brand" style={styles.facultyText}>{academicLabel}</Text></View>
        </View>
      </View>
      <View style={styles.mastery}>
        <View style={styles.masteryLabels}><Text variant="bodyMBold" style={styles.masteryLabel}>Dominio promedio · {level}</Text><Text variant="bodyMBold" color={mastery !== null && mastery > 70 ? 'success' : 'brand'}>{mastery === null ? '—' : `${mastery} %`}</Text></View>
        <ProgressBar value={mastery} tone={masteryTone(mastery)} label="Dominio promedio" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 24, gap: 16, experimental_backgroundImage: `linear-gradient(110deg, ${colors.primaryContainer} 0%, ${colors.secondaryPale} 100%)` },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 110 },
  copy: { flex: 1, minWidth: 0, gap: 4 },
  faculty: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  facultyText: { flex: 1 },
  mastery: { minHeight: 52, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colors.white, borderRadius: 16, gap: 6 },
  masteryLabels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  masteryLabel: { flex: 1 },
});
