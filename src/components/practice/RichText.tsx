import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, type TextVariant } from '@/components/ui';
import { colors, fonts } from '@/theme/tokens';
import type { RichTextSegment } from '@/types/exercise';
import { readableFormula } from './FormulaBlock';
export interface RichTextProps { segments: RichTextSegment[]; variant?: TextVariant }
/** Retains supplied words while presenting explicit inline code, emphasis and TeX. */
export function RichText({ segments, variant = 'bodyL' }: RichTextProps) {
  return <Text variant={variant}>{segments.flatMap<React.ReactNode>((segment, index) => {
    if (segment.isCode) return [<Text key={index} variant={variant} color="brand" style={styles.code}>{segment.text}</Text>];
    const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\\\([\s\S]*?\\\)|(?<!\\)\$[^$\n]+\$)/g;
    const pieces: React.ReactNode[] = [];
    let cursor = 0;
    for (const match of segment.text.matchAll(pattern)) {
      const start = match.index ?? 0;
      if (start > cursor) pieces.push(segment.text.slice(cursor, start));
      const token = match[0];
      pieces.push(token.startsWith('`') ? <Text key={`${index}-${start}`} variant={variant} color="brand" style={styles.code}>{token.slice(1, -1)}</Text>
        : token.startsWith('**') ? <Text key={`${index}-${start}`} variant={variant} style={styles.bold}>{token.slice(2, -2)}</Text>
          : <Text key={`${index}-${start}`} variant={variant} color="brand" style={styles.formula}>{readableFormula(token)}</Text>);
      cursor = start + token.length;
    }
    if (cursor < segment.text.length) pieces.push(segment.text.slice(cursor));
    return pieces;
  })}</Text>;
}
const styles = StyleSheet.create({ code: { fontFamily: fonts.mono, backgroundColor: colors.primaryContainerSoft },
  formula: { fontFamily: fonts.formula }, bold: { fontFamily: fonts.bold } });
