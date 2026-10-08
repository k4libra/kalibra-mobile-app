/**
 * Code snippet rendered as an editor window.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { CodeSnippet } from '@/types/exercise';

/**
 * Props accepted by {@link CodeBlock}.
 */
export interface CodeBlockProps {
  /** Snippet to show. */
  snippet: CodeSnippet;
}

/**
 * Renders the file name, the language and the source code on a dark editor surface.
 */
export function CodeBlock({ snippet }: CodeBlockProps) {
  return (
    <View style={styles.block}>
      <View style={styles.bar}>
        <View style={[styles.dot, styles.red]} />
        <View style={[styles.dot, styles.amber]} />
        <View style={[styles.dot, styles.green]} />
        <Text variant="bodyM" style={[styles.light, styles.file]}>
          {snippet.fileName}
        </Text>
        <Text variant="labelS" style={styles.light}>
          {snippet.language}
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.code}>{snippet.source}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surfaceCode },
  bar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: radius.full },
  red: { backgroundColor: colors.danger },
  amber: { backgroundColor: colors.tertiaryContainer },
  green: { backgroundColor: colors.secondaryAccent },
  file: { flex: 1, marginLeft: spacing.sm },
  light: { color: colors.onSurfaceCode },
  code: { ...typography.code, color: colors.onSurfaceCode },
});
