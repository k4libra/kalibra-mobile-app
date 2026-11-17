/**
 * Celebration banner primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, gradients, radius, shadows } from '@/theme/tokens';
import type { IconName } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';



/**
 * Outcome conveyed by the banner: `success` (green) or `danger` (red).
 */
export type HeroBannerTone = 'success' | 'danger';

// Gradient and badge color of each tone.
const TONE: Record<HeroBannerTone, { gradient: string; badge: string }> = {
  success: { gradient: gradients.success, badge: colors.secondaryStrong },
  danger: { gradient: gradients.danger, badge: colors.danger },
};

/**
 * Props accepted by {@link HeroBanner}.
 */
export interface HeroBannerProps {
  /** Outcome conveyed by the colors. */
  tone: HeroBannerTone;
  /** Icon inside the tilted badge. */
  icon: IconName;
  /** Headline of the outcome. */
  title: string;
  /** Sentence under the headline. */
  message: string;
  /** Text of the pill at the bottom. */
  pillLabel: string;
  /** Icon of the pill. */
  pillIcon: IconName;
}

/**
 * Renders a gradient banner with a tilted badge, a headline, a message and a pill, used to announce an outcome.
 *
 * @example
 * ```tsx
 * <HeroBanner tone="success" icon="check" title="Done!" message="..." pillLabel="Active" pillIcon="workspace_premium" />
 * ```
 */
export function HeroBanner({ tone, icon, title, message, pillLabel, pillIcon }: HeroBannerProps) {
  const palette = TONE[tone];
  return (
    <View accessibilityRole="summary" style={[styles.banner, { experimental_backgroundImage: palette.gradient }]}>
      <View style={[styles.badge, { backgroundColor: palette.badge }]}>
        <Icon name={icon} size="3xl" color={colors.white} />
      </View>
      <Text variant="headlineL" style={styles.center} isHeading>
        {title}
      </Text>
      <Text color="secondary" style={styles.center}>
        {message}
      </Text>
      <View style={styles.pill}>
        <View style={styles.pillIcon}>
          <Icon name={pillIcon} size="xs" color={palette.badge} />
        </View>
        <Text variant="bodyMBold" style={[styles.pillText, { color: palette.badge }]}>{pillLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { alignItems: 'center', gap: 12, padding: 20, borderRadius: radius.xxl, overflow: 'hidden', ...shadows.card },
  confetti: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.9 },
  badge: { width: 72, height: 72, borderRadius: radius.xxl, alignItems: 'center', justifyContent: 'center', marginBottom: 2, ...shadows.floating },
  center: { textAlign: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 0, paddingHorizontal: 14, paddingVertical: 5, borderRadius: radius.full, backgroundColor: colors.surfaceCard, ...shadows.card },
  pillText: { flexShrink: 1 },
  pillIcon: { width: 14, height: 14, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
});
