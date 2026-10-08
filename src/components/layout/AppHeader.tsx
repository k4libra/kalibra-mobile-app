/**
 * Top bar of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Text } from '@/components/ui';
import { colors, radius, shadows, spacing, TOUCH_TARGET } from '@/theme/tokens';

// Brand mark bundled with the app.
const LOGO = require('@/assets/images/logo.png');

/**
 * Props accepted by {@link AppHeader}.
 */
export interface AppHeaderProps {
  /** Screen title; when omitted the header shows the brand name (tab screens). */
  title?: string;
  /** Called when the user taps back; when omitted the back button is hidden. */
  onBack?: () => void;
  /** Called when the user taps the notifications bell; when omitted the bell is hidden. */
  onNotifications?: () => void;
  /** Called when the user taps the avatar. */
  onProfile?: () => void;
  /** Photo of the signed-in student. */
  avatar?: ImageSourcePropType;
}

/**
 * Renders the brand, the screen title and the header actions, below the status bar.
 *
 * @example
 * ```tsx
 * <AppHeader title="Subtemas" onBack={navigation.goBack} avatar={student.avatar} />
 * ```
 */
export function AppHeader({ title, onBack, onNotifications, onProfile, avatar }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack && (
            <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={onBack} hitSlop={8} style={styles.iconButton}>
              <Icon name="chevron_left" size="2xl" color={colors.contentPrimary} />
            </Pressable>
          )}
          <Image source={LOGO} style={title ? styles.logoSmall : styles.logo} accessibilityIgnoresInvertColors />
          {!title && <Text variant="headlineM">Kalibra</Text>}
        </View>
        {title && (
          <Text variant="title" numberOfLines={1} style={styles.title} isHeading>
            {title}
          </Text>
        )}
        <View style={[styles.side, styles.end]}>
          {onNotifications && (
            <Pressable accessibilityRole="button" accessibilityLabel="Notificaciones" onPress={onNotifications} style={styles.iconButton}>
              <Icon name="notifications" size="xl" color={colors.contentPrimary} />
            </Pressable>
          )}
          {avatar && (
            <Pressable accessibilityRole="button" accessibilityLabel="Mi perfil" onPress={onProfile} style={styles.iconButton}>
              <Image source={avatar} style={styles.avatar} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.surfaceBackground, ...shadows.card },
  row: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl },
  side: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minWidth: 88 },
  end: { justifyContent: 'flex-end', gap: spacing.xs },
  title: { flex: 1, textAlign: 'center' },
  iconButton: { width: TOUCH_TARGET, height: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', marginHorizontal: -spacing.md },
  logo: { width: 32, height: 32 },
  logoSmall: { width: 28, height: 28 },
  avatar: { width: 32, height: 32, borderRadius: radius.full },
});
