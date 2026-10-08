/**
 * Empty state primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import type { IconName } from '@/types/ui';
import { Button } from './Button';
import { Card } from './Card';
import { IconBox } from './IconBox';
import { Text } from './Text';

/**
 * Props accepted by {@link EmptyState}.
 */
export interface EmptyStateProps {
  /** Icon that represents the missing content. */
  icon: IconName;
  /** Short statement of what is missing. */
  title: string;
  /** Explanation of why it is empty and what to do next. */
  description: string;
  /** Label of the call to action; omit it to hide the button. */
  actionLabel?: string;
  /** Called when the user taps the call to action. */
  onAction?: () => void;
}

/**
 * Renders a centered card that explains why a screen has no content yet.
 *
 * @example
 * ```tsx
 * <EmptyState icon="school" title="Sin cursos" description="..." actionLabel="Ver invitaciones" onAction={open} />
 * ```
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card style={styles.card}>
      <IconBox icon={icon} size="xl" />
      <View style={styles.text}>
        <Text variant="title" style={styles.center} isHeading>
          {title}
        </Text>
        <Text variant="bodyM" color="secondary" style={styles.center}>
          {description}
        </Text>
      </View>
      {actionLabel && <Button label={actionLabel} variant="tonal" onPress={onAction} style={styles.action} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.xl, paddingHorizontal: spacing.xxxl, paddingVertical: spacing.xxxl },
  text: { gap: spacing.sm, alignItems: 'center' },
  center: { textAlign: 'center' },
  action: { alignSelf: 'stretch' },
});
