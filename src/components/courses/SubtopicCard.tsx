/** Data-driven subtopic practice card with qualitative and measured mastery. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Icon, IconBox, ProgressBar, Text, type TextColor } from '@/components/ui';
import { colors } from '@/theme/tokens';
import type { StudentSubtopic } from '@/types/course';
import type { Tone } from '@/types/ui';

/** Props accepted by the subtopic practice card. */
export interface SubtopicCardProps {
  subtopic: StudentSubtopic;
  onPractice: (subtopicId: string) => void;
}

const levelOf = (mastery: number | null): { label: string; tone: Tone; color: TextColor } => mastery === null
  ? { label: 'Sin práctica', tone: 'neutral', color: 'secondary' }
  : mastery > 70 ? { label: 'Dominio Alto', tone: 'success', color: 'success' }
    : mastery >= 40 ? { label: 'Dominio Medio', tone: 'primary', color: 'brand' }
      : { label: 'Dominio Bajo', tone: 'warning', color: 'warning' };

/** Starts a real practice session; missing mastery never becomes an invented zero. */
export function SubtopicCard({ subtopic, onPractice }: SubtopicCardProps) {
  const level = levelOf(subtopic.mastery);
  const isLow = subtopic.mastery !== null && subtopic.mastery < 40;
  const isNew = subtopic.mastery === null;
  return <Card style={styles.card}>
    <View style={styles.header}>
      <IconBox icon={subtopic.icon} tone={level.tone} size="lg" />
      <View style={styles.titles}>
        <Text variant="labelM" color={isLow ? 'warning' : 'secondary'}>{isLow ? 'Reforzar urgente' : `Tema ${String(subtopic.order).padStart(2, '0')}`}</Text>
        <Text variant="title" isHeading>{subtopic.name}</Text>
      </View>
    </View>
    <Text variant="bodyM" color="secondary" style={styles.description}>{subtopic.description || `Practica ${subtopic.name} y actualiza tu dominio con cada ejercicio.`}</Text>
    <View style={styles.progress}>
      <Chip label={level.label} tone={level.tone} icon={isLow ? 'error' : isNew ? 'menu_book' : 'query_stats'} />
      <View style={styles.flex}><ProgressBar value={subtopic.mastery} tone={isLow ? 'danger' : level.tone} label={`Dominio en ${subtopic.name}`} /></View>
      <Text variant="bodyMBold" color={level.color}>{subtopic.mastery === null ? '—' : `${subtopic.mastery} %`}</Text>
    </View>
    <View style={styles.footer}>
      <View style={styles.note}><Icon name={isNew ? 'menu_book' : isLow ? 'error' : subtopic.mastery! > 70 ? 'check_circle' : 'schedule'} size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary" style={styles.flex}>{subtopic.note || 'Sin práctica'}</Text></View>
      <Button label={isNew ? 'Comenzar' : 'Practicar'} size="sm" icon="arrow_forward" variant={isLow || isNew ? 'primary' : 'tonal'} onPress={() => onPractice(subtopic.id)} />
    </View>
  </Card>;
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 12, borderRadius: 24 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, titles: { flex: 1, gap: 2 }, description: { minHeight: 32 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 8 }, flex: { flex: 1 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, note: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
});
