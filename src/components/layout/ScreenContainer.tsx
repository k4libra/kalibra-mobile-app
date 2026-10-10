/**
 * Scrollable frame of a screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/tokens';

/**
 * Props accepted by {@link ScreenContainer}.
 */
export interface ScreenContainerProps {
  /** Header pinned at the top, usually an {@link AppHeader}. */
  header: React.ReactNode;
  /** Scrollable content of the screen. */
  children: React.ReactNode;
  /** Action pinned at the bottom of the screen, such as a submit button. */
  footer?: React.ReactNode;
  /**
   * Content spacing preset.
   *
   * @defaultValue `'default'`
   */
  variant?: 'default' | 'profile';
}

/**
 * Renders the header, a scrollable column with the page gutters and an optional bottom action tray.
 *
 * @example
 * ```tsx
 * <ScreenContainer header={<AppHeader />}>...</ScreenContainer>
 * ```
 */
export function ScreenContainer({ header, children, footer, variant = 'default' }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      {header}
      <ScrollView contentContainerStyle={[styles.content, variant === 'profile' && styles.profile]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { paddingTop: spacing.xs, paddingBottom: spacing.pageTop, flexGrow: 1 },
  screen: { flex: 1, backgroundColor: colors.surfaceBackground },
  content: { gap: spacing.xxxl, paddingHorizontal: spacing.gutter, paddingTop: spacing.xxxl, paddingBottom: spacing.pageBottom, maxWidth: 600, width: '100%', alignSelf: 'center' },
  footer: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, backgroundColor: colors.surfaceBackground },
});
