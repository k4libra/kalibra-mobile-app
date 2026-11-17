/**
 * Adaptive practice: data-driven code and mathematics with local session controls.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { AnswerOptionCard, CodeBlock, ExerciseCalibration, FormulaBlock, HintToggle, RichText, SessionSegments } from '@/components/practice';
import { Button, Card, Chip, EmptyState, ErrorState, Icon, IconBox, IconButton, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useExercise } from '@/hooks/usePractice';
import { useExerciseTimer } from '@/hooks/useExerciseTimer';
import { useExerciseCalibration } from '@/hooks/useExerciseCalibration';
import { calibrationState } from '@/utils/difficulty';
import { usePracticeSession } from '@/context/PracticeContext';
import type { RootScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme/tokens';
import type { IconName } from '@/types/ui';
import type { RichTextSegment, StatementSegment } from '@/types/exercise';

/** Shows one verified exercise and submits the chosen A–D key once. */
export function ExerciseScreen({ navigation, route }: RootScreenProps<'Exercise'>) {
  const { courseId, subtopicId, mode } = route.params;
  const { exercise, submit, isLoading, isSubmitting, isEmpty, error } = useExercise(courseId, subtopicId, mode);
  const { student } = useCurrentStudent();
  const { session } = usePracticeSession();
  const state = calibrationState(exercise?.difficulty);
  const calibration = useExerciseCalibration(exercise?.id, isLoading, state !== 'calibrating');
  const knownSubtopic = mode === 'EXPRESS' ? undefined : route.params.calibration;
  const timer = useExerciseTimer(calibration.isReady ? exercise?.id : undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isCode = Boolean(exercise?.statementSegments.some(segment => segment.type === 'code'))
    || /algorit|programa|recurs|árbol|arbol|grafo/i.test(exercise?.area ?? '');
  const content = splitQuestion(exercise?.statementSegments ?? [], exercise?.question ?? []);
  const subjectIcon: IconName = /árbol|arbol|grafo/i.test(exercise?.subtopicName ?? '') ? 'account_tree'
    : /dinámi|dinami|espacio/i.test(exercise?.subtopicName ?? '') ? 'layers'
      : isCode ? 'terminal' : 'grid_on';
  const blocked = !calibration.isReady || timer.isPaused || isSubmitting;

  const handleSubmit = async () => {
    if (!exercise || !selectedId || blocked) return;
    const result = await submit(exercise.id, selectedId, timer.getTimeSpentSeconds());
    if (result) navigation.replace('ExerciseResult', { attemptId: result.attemptId });
  };

  return (
    <>
      <ScreenContainer variant="practice"
        header={<AppHeader title="Práctica" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}
        footer={calibration.isReady && exercise && <Button label="Enviar respuesta" icon="arrow_forward" disabled={!selectedId || blocked} loading={isSubmitting} onPress={handleSubmit} />}
      >
        {error && (isEmpty
          ? <EmptyState icon="menu_book" title={error} description="Vuelve a intentarlo cuando tu docente haya habilitado ejercicios." />
          : <ErrorState message={error} />)}
        {(isLoading || exercise) && <View>
          {calibration.showCalibration && <Animated.View style={[calibration.isVisible && styles.calibrationOverlay, { opacity: calibration.opacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} pointerEvents="none" accessibilityElementsHidden={calibration.isVisible} importantForAccessibility={calibration.isVisible ? 'no-hide-descendants' : 'auto'}>
            <ExerciseCalibration state={state} subtopic={exercise?.subtopicName || knownSubtopic?.name} mastery={knownSubtopic?.mastery ?? undefined} isLongWait={calibration.isLongWait} />
          </Animated.View>}
          {calibration.isVisible && exercise && <Animated.View style={[styles.exerciseContent, { opacity: calibration.opacity }]} pointerEvents={calibration.isReady ? 'auto' : 'none'} accessibilityElementsHidden={!calibration.isReady} importantForAccessibility={calibration.isReady ? 'auto' : 'no-hide-descendants'}>
            <View style={styles.context}>
              <Chip label={exercise.subtopicName} icon={subjectIcon} />
              <Chip label={exercise.levelLabel || 'Nivel adaptativo'} icon="psychology" tone="neutral" />
            </View>
            <Card style={styles.progress}>
              <View style={styles.row}>
                <Text variant="headlineM" style={styles.flex}>
                  Ejercicio {exercise.position ?? 1}<Text variant="bodyL" color="secondary"> / {exercise.sessionSize ?? 5}</Text>
                </Text>
                <View style={styles.clock}>
                  <Icon name="schedule" size="sm" color={colors.contentSecondary} />
                  <Text variant="bodyMBold" color="secondary">{timer.elapsed}</Text>
                </View>
                <IconButton name="pause" label="Pausar práctica" onPress={timer.togglePause} style={styles.pause} />
              </View>
              <SessionSegments total={exercise.sessionSize ?? 5} reached={exercise.position ?? 1} outcomes={session?.outcomes} />
              <Chip label={exercise.difficultyLabel || 'Dificultad adaptativa'} icon="tune" tone="neutral" />
            </Card>
            <Card style={styles.problem}>
              <View style={styles.subject}>
                <IconBox icon={subjectIcon} size="md" />
                <Text variant="labelM" color="brand" style={styles.flex}>{exercise.area.toUpperCase()}</Text>
              </View>
              {content.statement.map((segment, index) => segment.type === 'code'
                ? <CodeBlock key={index} snippet={segment.snippet} />
                : segment.type === 'formula'
                  ? <FormulaBlock key={index} source={segment.source} />
                  : <RichText key={index} segments={[{ text: segment.text }]} />)}
              {content.question.length > 0 && (
                <View style={styles.question}>
                  <Icon name="help" size="lg" />
                  <View style={styles.flex}><RichText segments={content.question} variant="labelL" /></View>
                </View>
              )}
            </Card>
            <View accessibilityRole="radiogroup" style={styles.options}>
              {exercise.options.map(option => (
                <AnswerOptionCard key={option.id} option={option} isSelected={option.id === selectedId} disabled={blocked} isFormula={!isCode} onSelect={setSelectedId} />
              ))}
            </View>
            <HintToggle hint={exercise.hint || 'Lee el enunciado completo, identifica los datos y contrasta cada alternativa antes de responder.'} />
          </Animated.View>}
        </View>}
      </ScreenContainer>
      <Modal visible={timer.isPaused} transparent animationType="fade" onRequestClose={timer.togglePause}>
        <View style={styles.backdrop}>
          <Card style={styles.pauseDialog}>
            <IconBox icon="pause" size="lg" />
            <Text variant="headlineL" isHeading>Práctica en pausa</Text>
            <Text color="secondary" style={styles.center}>El temporizador está detenido. Continúa cuando estés listo.</Text>
            <Button label="Continuar práctica" icon="play_arrow" onPress={timer.togglePause} style={styles.stretch} />
          </Card>
        </View>
      </Modal>
    </>
  );
}

/** Moves a supplied final question into its own callout without synthesizing content. */
function splitQuestion(statement: StatementSegment[], supplied: RichTextSegment[]) {
  if (supplied.length > 0) return { statement, question: supplied };
  const last = statement[statement.length - 1];
  if (last?.type !== 'prose') return { statement, question: [{ text: 'Selecciona una alternativa para responder.' }] };
  const start = last.text.lastIndexOf('¿');
  if (start < 0 || !last.text.trimEnd().endsWith('?')) return { statement, question: [{ text: 'Selecciona una alternativa para responder.' }] };
  const prefix = last.text.slice(0, start).trimEnd();
  const body = statement.slice(0, -1);
  if (prefix) body.push({ type: 'prose', text: prefix });
  return { statement: body, question: [{ text: last.text.slice(start).trim() }] };
}

const styles = StyleSheet.create({
  exerciseContent: { gap: spacing.xl },
  calibrationOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  context: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  clock: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pause: { width: 36, height: 36, backgroundColor: colors.primaryContainerSoft },
  progress: { gap: spacing.lg, padding: spacing.xl },
  problem: { gap: 14 },
  subject: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  question: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.primarySubtle },
  options: { gap: 10 },
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.overlay },
  pauseDialog: { alignItems: 'center', padding: spacing.xxxl, gap: spacing.xl },
  center: { textAlign: 'center' },
  stretch: { alignSelf: 'stretch' },
});
