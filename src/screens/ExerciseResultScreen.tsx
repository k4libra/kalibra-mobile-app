/** Recorded practice outcome with its original explanation and mastery feedback. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { ExplanationCard, SessionSegments } from '@/components/practice';
import { Button, Callout, Chip, ErrorState, HeroBanner, Icon, LoadingState, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { usePracticeResult } from '@/hooks/usePractice';
import type { RootScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme/tokens';
import type { IconName } from '@/types/ui';

/** Shows the saved answer without resubmitting it, then continues the current visit. */
export function ExerciseResultScreen({ navigation, route }: RootScreenProps<'ExerciseResult'>) {
  const { result, isSessionComplete, mode, isLoading, error } = usePracticeResult(route.params.attemptId);
  const { student } = useCurrentStudent();
  const topic = result?.subtopicName ?? '';
  const subjectIcon: IconName = /árbol|arbol|grafo/i.test(topic) ? 'account_tree'
    : /dinámi|dinami|espacio/i.test(topic) ? 'layers'
      : /vector|transform|autoval|ortogon|derivad|integral|cálcul|calcu/i.test(topic) ? 'grid_on' : 'terminal';

  const continuePractice = () => {
    if (!result) return;
    if (isSessionComplete) navigation.popTo('CourseSubtopics', { courseId: result.courseId });
    else navigation.replace('Exercise', mode === 'EXPRESS'
      ? { courseId: result.courseId, mode }
      : { courseId: result.courseId, subtopicId: result.subtopicId, calibration: {
        name: result.subtopicName,
        mastery: result.currentMastery ?? null,
      } });
  };

  return (
    <ScreenContainer variant="practice" header={<AppHeader title="Resultado" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}>
      {error && <ErrorState message={error} />}
      {isLoading ? <LoadingState /> : result ? (
        <>
          <View style={styles.context}>
            <Chip label={result.subtopicName} icon={subjectIcon} />
            {result.position !== null && result.sessionSize !== null && <Chip label={`Ejercicio ${result.position} de ${result.sessionSize}`} icon="layers" tone="neutral" />}
          </View>
          {result.sessionSize !== null && <SessionSegments total={result.sessionSize} outcomes={result.sessionOutcomes} />}
          <HeroBanner
            tone={result.isCorrect ? 'success' : 'danger'}
            icon={result.isCorrect ? 'check' : 'close'}
            title={result.isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
            message={result.message}
            pillIcon={result.masteryDelta > 0 ? 'trending_up' : result.masteryDelta < 0 ? 'trending_down' : 'psychology'}
            pillLabel={result.masteryDelta > 0
              ? `Dominio en ${result.subtopicName} ↑ ${Math.round(result.masteryDelta)} pts`
              : result.masteryDelta < 0
                ? `Dominio en ${result.subtopicName} ↓ ${Math.abs(Math.round(result.masteryDelta))} pts`
                : `Dominio en ${result.subtopicName} sin cambios`}
          />
          {!result.isCorrect && <View style={styles.comparison}>
            <View style={[styles.answer, result.isCorrect ? styles.correct : styles.wrong]}>
              <View style={styles.row}><Icon name={result.isCorrect ? 'check_circle' : 'cancel'} size="sm" color={result.isCorrect ? colors.secondaryStrong : colors.danger} /><Text variant="bodyMBold" color={result.isCorrect ? 'success' : 'danger'}>Tu respuesta</Text></View>
              {result.selectedAnswer ? <View style={styles.row}>
                <View style={styles.letter}><Text variant="bodyMBold" color={result.isCorrect ? 'success' : 'danger'}>{result.selectedAnswer.letter}</Text></View>
                <Text variant="labelL" style={styles.flex}>{result.selectedAnswer.value}</Text>
              </View> : <Text variant="bodyM" color="secondary">No disponible en el historial</Text>}
            </View>
            <View style={[styles.answer, styles.correct]}>
              <View style={styles.row}><Icon name="check_circle" size="sm" color={colors.secondaryStrong} /><Text variant="bodyMBold" color="success">Respuesta correcta</Text></View>
              {result.correctAnswer ? <View style={styles.row}>
                <View style={styles.letter}><Text variant="bodyMBold" color="success">{result.correctAnswer.letter}</Text></View>
                <Text variant="labelL" style={styles.flex}>{result.correctAnswer.value}</Text>
              </View> : <Text variant="bodyM" color="success">Consulta la explicación</Text>}
            </View>
          </View>}
          {!result.isCorrect && <Callout icon="error" tone="danger" title="Dónde se rompió tu razonamiento" description="Revisa la explicación para identificar el paso que debes reforzar." />}
          <ExplanationCard result={result} />
          <Button label={isSessionComplete ? 'Volver al subtema' : 'Continuar practicando'} icon="arrow_forward" onPress={continuePractice} />
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  context: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md },
  comparison: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  answer: { flex: 1, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  wrong: { backgroundColor: colors.dangerContainer },
  correct: { backgroundColor: colors.secondaryPale },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  letter: { width: 28, height: 28, borderRadius: radius.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
