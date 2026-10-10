/**
 * Student avatar primitive with a verified badge and initials fallback.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
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
}
/**
 * Renders an account photo or initials and optional verification status.
 * @example
 * ```tsx
 * <Avatar name={user.fullName} source={photo} isVerified />
 * ```
 */
export function Avatar({ name, source, isVerified = false }: AvatarProps) {
  return <View style={styles.frame}>{source ? <Image source={source} accessibilityLabel={name} style={styles.photo} /> : <View style={styles.fallback}><Text variant="headlineL" color="brand">{initials(name)}</Text></View>}
    {isVerified && <View style={styles.badge}><Icon name="verified" color={colors.white} size="sm" /></View>}
  </View>;
}
const styles = StyleSheet.create({ frame: { width: 80, height: 80 }, photo: { width: '100%', height: '100%', borderRadius: radius.lg }, fallback: { flex: 1, borderRadius: radius.lg, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' }, badge: { position: 'absolute', bottom: -spacing.sm, right: -spacing.sm, width: 22, height: 22, borderRadius: radius.full, backgroundColor: colors.secondaryStrong, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' } });
