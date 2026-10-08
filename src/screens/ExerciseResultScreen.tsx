/**
 * Result screen of an answered exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { ExplanationCard, SessionSegments } from '@/components/practice';
import { Button, Chip, ErrorState, HeroBanner, LoadingState, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { usePracticeResult } from '@/hooks/usePractice';
import type { RootScreenProps } from '@/navigation/types';
import { spacing } from '@/theme/tokens';

/**
 * Shows whether the answer was correct, the mastery change and the explanation, using {@link usePracticeResult}.
 */
export function ExerciseResultScreen({ navigation, route }: RootScreenProps<'ExerciseResult'>) {
  const { result, isLoading, error } = usePracticeResult(route.params.attemptId);
  const { student } = useCurrentStudent();

  const continuePractice = () => {
    if (result) navigation.replace('Exercise', { courseId: result.courseId, subtopicId: result.subtopicId });
  };

  return (
    <ScreenContainer
      header={
        <AppHeader title="Resultado" onBack={navigation.goBack} avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />
      }
      footer={result && <Button label="Continuar practicando" icon="arrow_forward" onPress={continuePractice} />}
    >
      {error && <ErrorState message={error} />}
      {isLoading || !result ? (
        <LoadingState />
      ) : (
        <>
          <View style={styles.progress}>
            <View style={styles.row}>
              <Chip label={result.subtopicName} icon="account_tree" tone="neutral" />
              <Text variant="bodyMBold" color="brand">
                Ejercicio {result.position}/{result.sessionSize}
              </Text>
            </View>
            <SessionSegments total={result.sessionSize} outcomes={result.sessionOutcomes} />
          </View>
          <HeroBanner
            tone={result.isCorrect ? 'success' : 'danger'}
            icon={result.isCorrect ? 'check_circle' : 'close'}
            title={result.isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
            message={result.message}
            pillIcon="workspace_premium"
            pillLabel={
              result.masteryDelta > 0
                ? `Dominio en ${result.subtopicName} ↑ ${result.masteryDelta} pts`
                : `Dominio en ${result.subtopicName} sin cambios`
            }
          />
          <ExplanationCard result={result} />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progress: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
