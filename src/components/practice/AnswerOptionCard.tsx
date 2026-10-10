/**
 * Selectable answer option of an exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { AnswerOption } from '@/types/exercise';

/**
 * Props accepted by {@link AnswerOptionCard}.
 */
export interface AnswerOptionCardProps {
  /** Option to show. */
  option: AnswerOption;
  /** Whether the option is the current choice. */
  isSelected: boolean;
  /** Called with the option id when the student picks it. */
  onSelect: (optionId: string) => void;
}

/**
 * Renders an option as a radio card with its letter, value and note, and emits when the student picks it.
 */
export function AnswerOptionCard({ option, isSelected, onSelect }: AnswerOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`Opción ${option.letter}: ${option.value}`}
      onPress={() => onSelect(option.id)}
      style={[styles.card, isSelected && styles.selected]}
    >
      <View style={[styles.letter, isSelected && styles.letterSelected]}>
        <Text variant="bodyMBold" color={isSelected ? 'onPrimary' : 'primary'}>
          {option.letter}
        </Text>
      </View>
      <View style={styles.text}>
        <Text variant="headlineM">{option.value}</Text>
        <Text variant="labelM" color="secondary">
          {option.hint}
        </Text>
      </View>
      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <Icon name="check" size="sm" color={colors.white} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surfaceCard, ...shadows.card },
  selected: { backgroundColor: colors.primaryPaleSoft, ...shadows.floating },
  letter: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainerSoft },
  letterSelected: { backgroundColor: colors.primaryStrong },
  text: { flex: 1 },
  radio: { width: 24, height: 24, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer },
  radioSelected: { backgroundColor: colors.primaryStrong },
});
