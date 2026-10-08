/**
 * Collapsible hint of an exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link HintToggle}.
 */
export interface HintToggleProps {
  /** Hint revealed when the student opens the toggle. */
  hint: string;
}

/**
 * Renders a row that reveals the hint of the exercise when the student taps it.
 */
export function HintToggle({ hint }: HintToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      onPress={() => setIsOpen(open => !open)}
      style={styles.box}
    >
      <View style={styles.row}>
        <Icon name="lightbulb" size="sm" color={colors.contentSecondary} />
        <Text variant="bodyM" color="secondary" style={styles.flex}>
          ¿Necesitas una pista?
        </Text>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size="sm" color={colors.contentSecondary} />
      </View>
      {isOpen && <Text variant="bodyM">{hint}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.primarySubtle },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
});
