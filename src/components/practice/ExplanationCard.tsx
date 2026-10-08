/**
 * Step-by-step explanation of an exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Icon, IconBox, Text } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/theme/tokens';
import type { PracticeResult } from '@/types/exercise';

/**
 * Props accepted by {@link ExplanationCard}.
 */
export interface ExplanationCardProps {
  /** Result whose explanation is shown. */
  result: PracticeResult;
}

/**
 * Shows the explanation steps, the final summary and the learning tip of an answered exercise.
 */
export function ExplanationCard({ result }: ExplanationCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <IconBox icon="terminal" size="sm" />
        <Text variant="headlineM" style={styles.flex} isHeading>
          Explicación paso a paso
        </Text>
        <Chip label={result.explanationTag} tone="neutral" />
      </View>
      {result.steps.map(step => (
        <View key={step.order} style={[styles.step, step.isKey && styles.keyStep]}>
          <View style={[styles.order, step.isKey && styles.keyOrder]}>
            <Text variant="bodyMBold" color={step.isKey ? 'onPrimary' : 'brand'}>
              {step.order}
            </Text>
          </View>
          <View style={styles.flex}>
            <View style={styles.stepHeader}>
              <Text variant="bodyMBold" color={step.isKey ? 'success' : 'brand'} style={styles.mono}>
                {step.expression}
              </Text>
              {step.isKey ? <Chip label={step.tag} tone="success" /> : <Text variant="labelS" color="muted">{step.tag}</Text>}
            </View>
            <Text variant="bodyM">{step.description}</Text>
          </View>
        </View>
      ))}
      <View style={styles.summary}>
        <Icon name="functions" size="sm" color={colors.primaryStrong} />
        <Text variant="bodyMBold" style={styles.flex}>
          {result.summaryLabel}
        </Text>
        <Text variant="headlineM" color="brand">
          {result.summaryValue}
        </Text>
      </View>
      <View style={styles.tip}>
        <Icon name="lightbulb" size="sm" color={colors.tertiaryStrong} />
        <View style={styles.flex}>
          <Text variant="bodyMBold" color="warning">
            {result.tipTitle}
          </Text>
          <Text variant="bodyM" color="secondary">
            {result.tipBody}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  flex: { flex: 1 },
  step: { flexDirection: 'row', gap: spacing.lg, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primarySubtle },
  keyStep: { backgroundColor: colors.secondaryContainer },
  order: { width: 24, height: 24, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer },
  keyOrder: { backgroundColor: colors.secondaryStrong },
  stepHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  mono: { fontFamily: fonts.mono },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primaryContainerSoft },
  tip: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.tertiaryPale },
});
