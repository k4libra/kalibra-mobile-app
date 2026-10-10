/**
 * History tab of the student app.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { HistoryEntryCard, HistoryFilterTabs, PreviewToggle } from '@/components/progress';
import { Callout, Card, EmptyState, ErrorState, IconBox, LoadingState, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { usePracticeHistory } from '@/hooks/usePracticeHistory';
import { useProgress } from '@/hooks/useProgress';
import { useRootNavigation } from '@/navigation/useRootNavigation';
import { spacing } from '@/theme/tokens';
import { percent } from '@/utils/percent';

/**
 * Shows the accuracy, the filters and the recorded answers of the student, using {@link usePracticeHistory}.
 *
 * @remarks
 * Opening an answer shows its stored result; it never submits the answer again.
 */
export function HistoryScreen() {
  const navigation = useRootNavigation();
  const { student } = useCurrentStudent();
  const { history, filter, setFilter, entries, isLoading, error } = usePracticeHistory();
  const { selectedCourseId, progress } = useProgress();
  const [isEmptyPreview, setIsEmptyPreview] = useState(false);
  const hasHistory = Boolean(history && history.entries.length > 0) && !isEmptyPreview;

  const startPracticing = () => {
    const first = progress?.subtopics[0];
    if (first && selectedCourseId) navigation.navigate('Exercise', { courseId: selectedCourseId, subtopicId: first.id });
    else navigation.navigate('Tabs', { screen: 'Courses' });
  };

  return (
    <ScreenContainer
      header={<AppHeader avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}
    >
      <View style={styles.heading}>
        <Text variant="headlineL" isHeading>
          Historial de Práctica
        </Text>
        <Text variant="bodyM" color="secondary">
          Revisa tus razonamientos, optimiza tiempos y consolida tu intuición algorítmica.
        </Text>
      </View>

      {error && <ErrorState message={error} />}

      {isLoading ? (
        <LoadingState />
      ) : !history || !hasHistory ? (
        <EmptyState
          icon="hub"
          title="Todavía no tienes historial"
          description="Aquí verás cada ejercicio que resuelvas, con su resultado y el tiempo que te tomó."
          actionLabel="Resolver mi primer ejercicio"
          onAction={startPracticing}
        />
      ) : (
        <>
          <Card style={styles.summary}>
            <IconBox icon="query_stats" size="sm" />
            <Text variant="labelL" style={styles.flex}>
              Tasa de aciertos
            </Text>
            <Text variant="bodyMBold" color="success">
              {percent(history.summary.correct, history.summary.total) ?? 0}% aciertos
            </Text>
          </Card>
          <HistoryFilterTabs summary={history.summary} value={filter} onChange={setFilter} />
          <View style={styles.list}>
            {entries.map(entry => (
              <HistoryEntryCard
                key={entry.attemptId}
                entry={entry}
                onOpen={attemptId => navigation.navigate('ExerciseResult', { attemptId })}
              />
            ))}
          </View>
          {filter !== 'all' && (
            <Callout icon="lightbulb" tone="warning" title="Consejo de práctica espaciada" description={history.advice} />
          )}
        </>
      )}

      {history && history.entries.length > 0 && (
        <View style={styles.preview}>
          <Text variant="bodyM" color="secondary">
            Simulación de estados
          </Text>
          <PreviewToggle
            label={isEmptyPreview ? 'Ver historial' : 'Previsualizar historial vacío'}
            onPress={() => setIsEmptyPreview(value => !value)}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  flex: { flex: 1 },
  list: { gap: spacing.lg },
  preview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
