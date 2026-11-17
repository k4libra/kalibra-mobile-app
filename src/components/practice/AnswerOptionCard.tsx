/**
 * Selectable answer option of an exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, fonts, radius, shadows, spacing } from '@/theme/tokens';
import { readableFormula } from './FormulaBlock';
import type { AnswerOption } from '@/types/exercise';

/**
 * Props accepted by {@link AnswerOptionCard}.
 */
export interface AnswerOptionCardProps {
  /** Option to show. */
  option: AnswerOption;
  /** Whether the option is the current choice. */
  isSelected: boolean;
  disabled?: boolean;
  isFormula?: boolean;
  /** Called with the option id when the student picks it. */
  onSelect: (optionId: string) => void;
}

/**
 * Renders an option as a radio card with its letter, value and note, and emits when the student picks it.
 */
export function AnswerOptionCard({ option, isSelected, onSelect, disabled = false, isFormula = false }: AnswerOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled }}
      disabled={disabled}
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
        <Text variant="title" style={isFormula && styles.formula}>{isFormula ? readableFormula(option.value) : option.value}</Text>
        {option.hint ? <Text variant="bodyM" color="secondary">{option.hint}</Text> : null}
      </View>
      <Icon name={isSelected ? 'check_circle' : 'radio_button_unchecked'} size="lg" color={isSelected ? colors.primary : colors.surfaceBorder} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.surfaceBorder, ...shadows.card },
  selected: { backgroundColor: colors.primaryContainerSoft, borderWidth: 1.5, borderColor: colors.primary },
  letter: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainerSoft },
  formula: { fontFamily: fonts.formula, fontSize: 20, lineHeight: 28 },
  letterSelected: { backgroundColor: colors.primary },
  text: { flex: 1 },
  radio: { width: 24, height: 24, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer },
  radioSelected: { backgroundColor: colors.primary },
});
