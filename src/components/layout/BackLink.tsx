/**
 * Inline link back to a previous section.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link BackLink}.
 */
export interface BackLinkProps {
  /** Name of the destination, for example `Mis cursos`. */
  label: string;
  /** Called when the user taps the link. */
  onPress: () => void;
}

/**
 * Renders an arrow and the name of the section the user goes back to.
 *
 * @example
 * ```tsx
 * <BackLink label="Mis cursos" onPress={goToCourses} />
 * ```
 */
export function BackLink({ label, onPress }: BackLinkProps) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={12} style={styles.link}>
      <Icon name="arrow_back" size="sm" color={colors.primaryStrong} />
      <Text variant="labelL" color="brand">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: spacing.sm },
});
