/** Recorded practice outcomes, server-backed filters and result navigation. */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Button, Card, Chip, ErrorState, Icon, IconBox, LoadingState, ProgressBar, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { usePracticeHistory } from '@/hooks/usePracticeHistory';
import { useProgress } from '@/hooks/useProgress';
import { useRootNavigation } from '@/navigation/useRootNavigation';
import { colors, radius } from '@/theme/tokens';
import type { HistoryEntry, HistoryFilter } from '@/types/progress';
import { percent } from '@/utils/percent';

const FILTERS: { value: HistoryFilter; label: string; count: 'total' | 'correct' | 'incorrect' }[] = [
  { value: 'all', label: 'Todos', count: 'total' },
  { value: 'correct', label: 'Correctos', count: 'correct' },
  { value: 'review', label: 'Para repasar', count: 'incorrect' },
];

/** Opens stored results without resubmitting answers and preserves global filter counts. */
export function HistoryScreen() {
  const navigation = useRootNavigation();
  const { student } = useCurrentStudent();
  const { history, filter, setFilter, entries, isLoading, error } = usePracticeHistory();
  const { selectedCourseId, progress } = useProgress();
  const [isEmptyPreview, setIsEmptyPreview] = useState(false);
  const hasHistory = Boolean(history && history.summary.total > 0) && !isEmptyPreview;
  const startPracticing = () => {
    const first = progress?.subtopics[0];
    if (first && selectedCourseId) navigation.navigate('Exercise', { courseId: selectedCourseId, subtopicId: first.id, calibration: { name: first.name, mastery: first.mastery } });
    else navigation.navigate('Tabs', { screen: 'Courses' });
  };
  const accuracy = history ? percent(history.summary.correct, history.summary.total) ?? 0 : 0;

  return <ScreenContainer header={<AppHeader avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}>
    <View style={styles.stack}>
      <View style={styles.heading}><Text variant="headlineL" isHeading>Historial de práctica</Text><Text color="secondary">Revisa tus razonamientos, optimiza tiempos y consolida tu intuición algorítmica.</Text></View>
      {error && <ErrorState message={error} />}
      {isLoading ? <LoadingState /> : error ? null : !hasHistory ? <Card style={styles.empty}>
        <View style={styles.illustration}><Icon name="history" size="4xl" /></View>
        <Text variant="headlineM" isHeading style={styles.center}>Todavía no tienes historial</Text>
        <Text color="secondary" style={styles.center}>Aquí verás cada ejercicio que resuelvas, con su resultado y el tiempo que te tomó.</Text>
        <Button label="Resolver mi primer ejercicio" icon="arrow_forward" onPress={startPracticing} style={styles.stretch} />
      </Card> : history && <>
        <Card style={styles.summary}>
          <View style={styles.row}><IconBox icon="query_stats" size="lg" tone="success" /><View style={styles.flex}><Text variant="bodyM" color="secondary">Tasa de aciertos</Text><Text variant="headlineL">{accuracy}% aciertos</Text></View><Text variant="bodyMBold" color="success">{history.summary.correct} de {history.summary.total}</Text></View>
          <ProgressBar value={accuracy} tone="success" label="Tasa de aciertos" />
        </Card>
        <View accessibilityRole="tablist" style={styles.filters}>{FILTERS.map(item => {
          const selected = filter === item.value;
          const count = history.summary[item.count];
          return <Pressable key={item.value} accessibilityRole="tab" accessibilityLabel={`${item.label}, ${count}`} accessibilityState={{ selected }} onPress={() => setFilter(item.value)} style={[styles.filter, selected && styles.activeFilter]}>
            <Text variant="bodyMBold" color={selected ? 'onPrimary' : 'secondary'}>{item.label}</Text>
            <View style={[styles.filterCount, selected && styles.activeCount]}><Text variant="labelM" color={selected ? 'onPrimary' : 'brand'}>{count}</Text></View>
          </Pressable>;
        })}</View>
        <View style={styles.stack}>{entries.length > 0 ? entries.map(entry => <HistoryRow key={entry.attemptId} entry={entry} onOpen={() => navigation.navigate('ExerciseResult', { attemptId: entry.attemptId })} />) : <Card style={styles.noMatches}><Text variant="title">No hay ejercicios con este resultado</Text><Text variant="bodyM" color="secondary">Elige otro filtro para revisar tus ejercicios.</Text></Card>}</View>
        {filter !== 'all' && <Card style={styles.advice}><IconBox icon="lightbulb" size="md" tone="neutral" /><View style={styles.flex}><Text variant="labelL" color="warning">Consejo de práctica espaciada</Text><Text variant="bodyM">{history.advice}</Text></View></Card>}
      </>}
      {!error && history && history.summary.total > 0 && <View style={styles.preview}>
        <Text variant="labelM" color="secondary">Simulación de estados</Text><Button label={isEmptyPreview ? 'Ver historial' : 'Previsualizar historial vacío'} variant="ghost" size="sm" onPress={() => setIsEmptyPreview(value => !value)} />
      </View>}
    </View>
  </ScreenContainer>;
}

function HistoryRow({ entry, onOpen }: { entry: HistoryEntry; onOpen: () => void }) {
  const correct = entry.result === 'correct';
  return <Pressable accessibilityRole="button" accessibilityLabel={`${entry.title}. Ver desglose`} onPress={onOpen}>
    <Card style={styles.entry}>
      <View style={styles.entryRow}>
        <IconBox icon={correct ? 'check_circle' : 'cancel'} size="lg" tone={correct ? 'success' : 'danger'} />
        <View style={styles.entryCopy}>
          <View style={styles.entryMeta}><Text variant="labelM" color="secondary" style={styles.flex}>{entry.subtopicName}</Text><Chip label={correct ? 'Correcto' : 'Incorrecto'} tone={correct ? 'success' : 'danger'} icon={correct ? 'check' : 'close'} /></View>
          <Text variant="title" numberOfLines={3}>{entry.title}</Text>
          <View style={styles.time}><Icon name="calendar_month" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">{entry.answeredAt}</Text><Icon name="schedule" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">{entry.duration ?? 'Sin registro'}</Text></View>
        </View>
      </View>
      <View style={styles.entryFooter}><Text variant="bodyMBold" color="brand">Ver desglose</Text><Icon name="arrow_forward" size="xs" /></View>
    </Card>
  </Pressable>;
}

const styles = StyleSheet.create({
  stack: { gap: 20 }, heading: { gap: 6 }, summary: { padding: 16, gap: 12, borderRadius: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, flex: { flex: 1, gap: 2 },
  filters: { flexDirection: 'row', backgroundColor: colors.white, padding: 4, borderRadius: radius.full, gap: 4 }, filter: { flex: 1, minHeight: 36, borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }, activeFilter: { backgroundColor: colors.primary }, filterCount: { minWidth: 21, height: 14, paddingHorizontal: 6, borderRadius: radius.full, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' }, activeCount: { backgroundColor: 'rgba(255,255,255,.25)' },
  entry: { borderRadius: 24, padding: 14, gap: 12 }, entryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, entryCopy: { flex: 1, gap: 4 }, entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 26 }, time: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }, entryFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, borderTopWidth: 1, borderTopColor: colors.lineDefault, paddingTop: 10, minHeight: 27 },
  advice: { flexDirection: 'row', gap: 12, borderRadius: 20, padding: 14, backgroundColor: '#FFF3E2' },
  empty: { padding: 24, borderRadius: 24, alignItems: 'center', gap: 14 }, illustration: { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center', experimental_backgroundImage: 'linear-gradient(135deg, #E2E7FF 0%, #DDFBEE 100%)' }, center: { textAlign: 'center' }, stretch: { alignSelf: 'stretch' },
  noMatches: { gap: 6, padding: 24 }, preview: { gap: 8, borderWidth: 1, borderColor: colors.lineDefault, borderRadius: 20, padding: 16 },
});
