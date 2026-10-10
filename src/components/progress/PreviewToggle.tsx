/**
 * Link that previews the empty state of a screen.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link PreviewToggle}.
 */
export interface PreviewToggleProps {
  /** Text of the link. */
  label: string;
  /** Called when the student taps the link. */
  onPress: () => void;
}

/**
 * Renders a small tinted link used to switch between the populated and the initial state.
 */
export function PreviewToggle({ label, onPress }: PreviewToggleProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={12} style={styles.pill}>
      <Icon name="unfold_more" size="xs" color={colors.contentSecondary} />
      <Text variant="labelS" color="secondary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: colors.primaryContainerSoft },
});
