/**
 * Confirmation dialog primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { IconName, Tone } from '@/types/ui';
import { Button } from './Button';
import { IconBox } from './IconBox';
import { Text } from './Text';

/**
 * Props accepted by {@link ConfirmDialog}.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is visible. */
  isVisible: boolean;
  /** Icon shown above the title. */
  icon: IconName;
  /**
   * Color family of the icon and of the confirm button (`danger` makes it destructive).
   *
   * @defaultValue `'primary'`
   */
  tone?: Extract<Tone, 'primary' | 'danger'>;
  /** Question the user answers. */
  title: string;
  /** Consequence of confirming. */
  description: string;
  /** Label of the confirm button. */
  confirmLabel: string;
  /** Icon of the confirm button. */
  confirmIcon?: IconName;
  /**
   * Label of the cancel button.
   *
   * @defaultValue `'Cancelar'`
   */
  cancelLabel?: string;
  /** Called when the user confirms. */
  onConfirm: () => void;
  /** Called when the user cancels or uses the back gesture. */
  onCancel: () => void;
}

/**
 * Renders a centered card over a dimmed backdrop that asks the user to confirm an action.
 *
 * @example
 * ```tsx
 * <ConfirmDialog isVisible icon="school" title="Join?" description="..." confirmLabel="Yes, join" onConfirm={join} onCancel={close} />
 * ```
 */
export function ConfirmDialog({
  isVisible,
  icon,
  tone = 'primary',
  title,
  description,
  confirmLabel,
  confirmIcon,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.card}>
          <IconBox icon={icon} tone={tone} size="lg" style={styles.badge} />
          <View style={styles.text}>
            <Text variant="headlineL" style={styles.center} isHeading>
              {title}
            </Text>
            <Text color="secondary" style={styles.center}>
              {description}
            </Text>
          </View>
          <View style={styles.actions}>
            <Button label={confirmLabel} icon={confirmIcon} variant={tone === 'danger' ? 'danger' : 'primary'} onPress={onConfirm} />
            <Button label={cancelLabel} variant="neutral" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.gutter, backgroundColor: colors.overlay },
  card: { alignItems: 'center', gap: spacing.xl, padding: spacing.xxxl, borderRadius: radius.lg, backgroundColor: colors.surfaceCard, ...shadows.floating },
  badge: { width: 56, height: 56, borderRadius: radius.lg },
  text: { gap: spacing.md },
  center: { textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: spacing.md },
});
