/**
 * Academic portal brand mark for account access compositions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radius, shadows } from '@/theme/tokens';
/**
 * Renders the academic sigma mark with the primary brand treatment.
 * @example
 * ```tsx
 * <BrandMark />
 * ```
 */
export function BrandMark() { return <View style={styles.mark}><Icon name="functions" size="2xl" color={colors.white} /></View>; }
const styles = StyleSheet.create({ mark: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryStrong, alignItems: 'center', justifyContent: 'center', ...shadows.raised } });
