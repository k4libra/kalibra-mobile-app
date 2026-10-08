/**
 * Section title primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { Text } from './Text';

/**
 * Props accepted by {@link SectionTitle}.
 */
export interface SectionTitleProps {
  /** Heading of the section. */
  title: string;
  /** Short count or note aligned to the right. */
  caption?: string;
}

/**
 * Renders the heading of a list section with an optional caption on the right.
 *
 * @example
 * ```tsx
 * <SectionTitle title="Pending" caption="1 invitation" />
 * ```
 */
export function SectionTitle({ title, caption }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text variant="title" isHeading>
        {title}
      </Text>
      {caption && (
        <Text variant="labelM" color="secondary">
          {caption}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
});
