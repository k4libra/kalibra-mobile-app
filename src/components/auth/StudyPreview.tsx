/**
 * Account access study preview with data supplied by the form hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Icon, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';
import type { StudyPreviewData } from '@/types/auth';
/** Props accepted by {@link StudyPreview}. */
export interface StudyPreviewProps {
  /** Generic recommendation returned by the service. */
  preview: StudyPreviewData;
}
/** Shows the study reminder and its reference illustration. */
export function StudyPreview({ preview }: StudyPreviewProps) {
  return <Card style={styles.row}><Image source={preview.image} style={styles.image} accessibilityIgnoresInvertColors /><View style={styles.copy}>
    <View style={styles.title}><Text variant="bodyMBold" color="brand">Tu dominio se actualiza con cada ejercicio</Text><Icon name="local_fire_department" size="xs" color={colors.secondaryStrong} /></View>
    <Text variant="bodyM" color="secondary">{preview.description}</Text>
  </View></Card>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, paddingVertical: spacing.xxl }, image: { width: spacing.xxxl + spacing.xxxl + spacing.md, height: spacing.xxxl + spacing.xxxl + spacing.xs, borderRadius: radius.sm }, copy: { flex: 1, gap: spacing.xxs }, title: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs } });
