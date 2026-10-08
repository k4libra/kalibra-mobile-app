/**
 * Celebration banner primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, gradients, radius, shadows, spacing } from '@/theme/tokens';
import type { IconName } from '@/types/ui';
import { Icon } from './Icon';
import { Text } from './Text';

// Confetti drawn over positive banners.
const CONFETTI = require('@/assets/images/confetti.png');

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
      {tone === 'success' && <Image source={CONFETTI} resizeMode="cover" style={styles.confetti} accessibilityIgnoresInvertColors />}
      <View style={[styles.badge, { backgroundColor: palette.badge }]}>
        <Icon name={icon} size="2xl" color={colors.white} />
      </View>
      <Text variant="headlineL" style={styles.center} isHeading>
        {title}
      </Text>
      <Text color="secondary" style={styles.center}>
        {message}
      </Text>
      <View style={styles.pill}>
        <View style={styles.pillIcon}>
          <Icon name={pillIcon} size="xs" color={colors.tertiaryStrong} />
        </View>
        <Text variant="bodyMBold">{pillLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { alignItems: 'center', gap: spacing.md, padding: spacing.xxl, borderRadius: radius.lg, overflow: 'hidden', ...shadows.card },
  confetti: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.9 },
  badge: { width: 64, height: 64, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-3deg' }], marginBottom: spacing.md, ...shadows.floating },
  center: { textAlign: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md, paddingHorizontal: 14, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.surfaceCard, ...shadows.card },
  pillIcon: { width: 20, height: 20, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tertiaryPale },
});
