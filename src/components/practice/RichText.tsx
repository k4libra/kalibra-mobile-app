/**
 * Sentence with inline code pieces.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/ui';
import { colors, fonts } from '@/theme/tokens';
import type { RichTextSegment } from '@/types/exercise';

/**
 * Props accepted by {@link RichText}.
 */
export interface RichTextProps {
  /** Pieces of the sentence. */
  segments: RichTextSegment[];
}

/**
 * Renders a sentence where code pieces use a monospace font on a tinted background.
 */
export function RichText({ segments }: RichTextProps) {
  return (
    <Text>
      {segments.map((segment, index) =>
        segment.isCode ? (
          <Text key={index} color="brand" style={styles.code}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  code: { fontFamily: fonts.mono, backgroundColor: colors.primaryContainerSoft },
});
