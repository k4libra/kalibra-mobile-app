/**
 * Empty state primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { gradients } from '@/theme/tokens';
import type { ButtonVariant, IconName } from '@/types/ui';
import { Button } from './Button';
import { Card } from './Card';
import { IconBox } from './IconBox';
import { Icon } from './Icon';
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
  /** Invitation lists use the compact 56-point tile and 44-point action. */
  compact?: boolean;
  /** Visual style of the optional action. */
  actionVariant?: ButtonVariant;
  /** Optional leading icon of the action. */
  actionIcon?: IconName;
}

/**
 * Renders a centered card that explains why a screen has no content yet.
 *
 * @example
 * ```tsx
 * <EmptyState icon="school" title="Sin cursos" description="..." actionLabel="Ver invitaciones" onAction={open} />
 * ```
 */
export function EmptyState({ icon, title, description, actionLabel, onAction, compact = false, actionVariant = 'tonal', actionIcon }: EmptyStateProps) {
  return (
    <Card style={[styles.card, compact && styles.compactCard]}>
      {compact ? <IconBox icon={icon} size="xl" /> : <View style={styles.illustration}><Icon name={icon} size="4xl" /></View>}
      <View style={[styles.text, compact && styles.compactText]}>
        <Text variant={compact ? 'title' : 'headlineM'} style={styles.center} isHeading>
          {title}
        </Text>
        <Text variant={compact ? 'bodyM' : 'bodyL'} color="secondary" style={styles.center}>
          {description}
        </Text>
      </View>
      {actionLabel && <Button label={actionLabel} variant={actionVariant} icon={actionIcon} iconPosition="start" size={compact ? 'sm' : 'md'} onPress={onAction} style={styles.action} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: 14, padding: 24, borderRadius: 24 },
  compactCard: { padding: 22, gap: 12 },
  illustration: { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center', experimental_backgroundImage: gradients.soft },
  text: { gap: 14, alignItems: 'center' },
  compactText: { gap: 12 },
  center: { textAlign: 'center' },
  action: { alignSelf: 'stretch' },
});
