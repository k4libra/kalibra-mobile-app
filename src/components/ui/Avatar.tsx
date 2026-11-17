/**
 * Student avatar primitive with a verified badge and initials fallback.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import { initials } from '@/utils/identity';
import { Icon } from './Icon';
import { Text } from './Text';
/** Props accepted by {@link Avatar}. */
export interface AvatarProps {
  /** Full name used for accessible content and the fallback. */
  name: string;
  /** Optional account photo. */
  source?: ImageSourcePropType;
  /**
   * Displays the institutional verification badge.
   *
   * @defaultValue `false`
   */
  isVerified?: boolean;
  size?: number;
}
/**
 * Renders an account photo or initials and optional verification status.
 * @example
 * ```tsx
 * <Avatar name={user.fullName} source={photo} isVerified />
 * ```
 */
export function Avatar({ name, source, isVerified = false, size = 80 }: AvatarProps) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={name} style={[styles.frame, { width: size, height: size }]}>
      <View style={styles.portrait}>
        {source ? <Image source={source} accessible={false} style={styles.photo} /> : <View style={styles.fallback}><Text variant="headlineL" color="brand">{initials(name)}</Text></View>}
      </View>
      {isVerified && <View style={[styles.badge, { left: size - 26, top: size - 26 }]}><Icon name="verified" color={colors.secondaryStrong} size="lg" /></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: 80, height: 80 },
  portrait: { flex: 1, borderRadius: radius.full, borderWidth: 2, borderColor: colors.white },
  photo: { width: '100%', height: '100%', borderRadius: radius.full },
  fallback: { flex: 1, borderRadius: radius.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', width: 28, height: 28, borderRadius: radius.full, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
