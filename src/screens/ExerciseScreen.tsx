/**
 * Exercise screen of the adaptive practice.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { AnswerOptionCard, CodeBlock, HintToggle, RichText, SessionSegments } from '@/components/practice';
import { Button, Card, Chip, ErrorState, Icon, LoadingState, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useExercise } from '@/hooks/usePractice';
import type { RootScreenProps } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme/tokens';

/**
 * Shows the next exercise of the subtopic in the route and submits the chosen option, using {@link useExercise}.
 */
export function ExerciseScreen({ navigation, route }: RootScreenProps<'Exercise'>) {
  const { courseId, subtopicId } = route.params;
  const { exercise, submit, isLoading, isSubmitting, error } = useExercise(courseId, subtopicId);
  const { student } = useCurrentStudent();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!exercise || !selectedId) return;
    const result = await submit(exercise.id, selectedId);
    if (result) navigation.navigate('ExerciseResult', { attemptId: result.attemptId });
  };

  return (
    <ScreenContainer
      header={
        <AppHeader
          title="Práctica de ejercicio"
          onBack={navigation.goBack}
          avatar={student?.avatar}
          onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })}
        />
      }
      footer={
        exercise && (
          <Button label="Enviar respuesta" icon="arrow_forward" disabled={!selectedId || isSubmitting} onPress={handleSubmit} />
        )
      }
    >
      {error && <ErrorState message={error} />}
      {isLoading || !exercise ? (
        <LoadingState />
      ) : (
        <>
          <View style={styles.meta}>
            <View style={styles.row}>
              <Icon name="psychology" size="sm" color={colors.primaryStrong} />
              <Text variant="bodyMBold" color="secondary" style={styles.flex}>
                {exercise.subtopicName.toUpperCase()} • {exercise.levelLabel}
              </Text>
              <Chip label="En curso" tone="neutral" icon="pause" />
            </View>
            <Card style={styles.progress}>
              <View style={styles.row}>
                <Text variant="title" style={styles.flex}>
                  Ejercicio {exercise.position}{' '}
                  <Text variant="bodyM" color="muted">
                    / {exercise.sessionSize}
                  </Text>
                </Text>
                <Icon name="bolt" size="sm" color={colors.primaryStrong} />
                <Text variant="bodyMBold" color="brand">
                  +{exercise.sessionPoints} pts
                </Text>
              </View>
              <SessionSegments total={exercise.sessionSize} reached={exercise.position} />
            </Card>
            <View style={styles.row}>
              <Chip label={exercise.difficultyLabel} icon="tune" />
              <View style={styles.flex} />
              <Icon name="timer" size="xs" color={colors.contentSecondary} />
              <Text variant="labelS" color="secondary">
                {exercise.elapsed}
              </Text>
            </View>
          </View>

          <Card style={styles.problem}>
            <View style={styles.row}>
              <Icon name="terminal" size="sm" color={colors.primaryStrong} />
              <Text variant="bodyMBold" color="brand">
                {exercise.area}
              </Text>
            </View>
            <RichText segments={exercise.prompt} />
            {exercise.code && <CodeBlock snippet={exercise.code} />}
            <View style={styles.question}>
              <Icon name="help" size="lg" color={colors.primaryStrong} />
              <View style={styles.flex}>
                <RichText segments={exercise.question} />
              </View>
            </View>
          </Card>

          <View accessibilityRole="radiogroup" style={styles.options}>
            {exercise.options.map(option => (
              <AnswerOptionCard key={option.id} option={option} isSelected={option.id === selectedId} onSelect={setSelectedId} />
            ))}
          </View>
          <HintToggle hint={exercise.hint} />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  meta: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  progress: { gap: spacing.sm, padding: spacing.md },
  problem: { gap: spacing.md },
  question: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primarySubtle },
  options: { gap: spacing.md },
});
