/** Display-only code editor with line numbers and source-preserving syntax colors. */
import React from 'react';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { Icon, Text } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/theme/tokens';
import type { CodeSnippet } from '@/types/exercise';

export interface CodeBlockProps {
  /** Source metadata is supplied by the exercise; no file name is invented. */
  snippet: CodeSnippet;
}

type SyntaxKind = 'plain' | 'keyword' | 'function' | 'number' | 'string' | 'comment';
interface SyntaxToken { text: string; kind: SyntaxKind }
const KEYWORDS = new Set('and as assert async await break case catch class const continue def default del do elif else enum except export extends false False final finally for from function if implements import in instanceof int interface is lambda let new None not null of or pass private protected public raise return static super switch this throw throws true True try typeof var void while with yield'.split(' '));
const SYNTAX: Record<SyntaxKind, string> = {
  plain: colors.onSurfaceCode,
  keyword: '#c792ea',
  function: '#50e3c2',
  number: '#f78c6c',
  string: '#c3e88d',
  comment: '#7d859f',
};

/** Lexes colors only: tokens concatenate to the original line, and source is never evaluated. */
export function tokenizeCodeLine(line: string, startsInComment = false) {
  const tokens: SyntaxToken[] = [];
  let position = 0;
  let inComment = startsInComment;
  while (position < line.length) {
    const rest = line.slice(position);
    if (inComment) {
      const end = rest.indexOf('*/');
      const text = end < 0 ? rest : rest.slice(0, end + 2);
      tokens.push({ text, kind: 'comment' });
      position += text.length;
      inComment = end < 0;
      continue;
    }
    if (rest.startsWith('/*')) {
      const end = rest.indexOf('*/', 2);
      const text = end < 0 ? rest : rest.slice(0, end + 2);
      tokens.push({ text, kind: 'comment' });
      position += text.length;
      inComment = end < 0;
      continue;
    }
    const match = /^(?:\/\/.*|#.*|'(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?|\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|[\p{L}_$][\p{L}\p{N}_$]*|\s+|.)/u.exec(rest);
    const text = match?.[0] ?? rest[0];
    let kind: SyntaxKind = 'plain';
    if (text.startsWith('//') || text.startsWith('#')) kind = 'comment';
    else if (/^['"`]/.test(text)) kind = 'string';
    else if (/^\d/.test(text)) kind = 'number';
    else if (KEYWORDS.has(text)) kind = 'keyword';
    else if (/^[\p{L}_$]/u.test(text) && /^\s*\(/.test(rest.slice(text.length))) kind = 'function';
    tokens.push({ text, kind });
    position += text.length;
  }
  return { tokens, inComment };
}

/** Wraps each source line after its indentation instead of clipping it horizontally. */
export function CodeBlock({ snippet }: CodeBlockProps) {
  let inComment = false;
  const lines = snippet.source.split(/\r\n|\r|\n/).map(line => {
    const indent = /^\s*/.exec(line)?.[0] ?? '';
    const indentation = indent.replace(/\t/g, '    ').length;
    const colored = tokenizeCodeLine(line.slice(indent.length), inComment);
    inComment = colored.inComment;
    return { indentation, tokens: colored.tokens };
  });
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Icon name="terminal" size="sm" color={colors.primaryPale} />
        <Text variant="bodyM" numberOfLines={1} style={styles.file}>{snippet.fileName.trim() || 'Código'}</Text>
        <View style={styles.languagePill}><Text variant="labelS" style={styles.language}>{snippet.language.trim() || 'Código'}</Text></View>
      </View>
      <View accessible accessibilityLabel={snippet.source} style={styles.body}>
        {lines.map((line, index) => (
          <View key={index} style={styles.line}>
            <NativeText accessible={false} style={styles.number}>{index + 1}</NativeText>
            <View style={styles.content}>
              <NativeText accessible={false} style={[styles.code, { paddingLeft: line.indentation * 7.2 }]}>
                {line.tokens.length === 0 ? ' ' : line.tokens.map((token, tokenIndex) => (
                  <NativeText key={tokenIndex} style={{ color: SYNTAX[token.kind] }}>{token.text}</NativeText>
                ))}
              </NativeText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { borderRadius: radius.lg, backgroundColor: colors.surfaceCode, overflow: 'hidden' },
  header: { height: 39, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  file: { flex: 1, color: colors.onSurfaceCode, fontFamily: fonts.monoMedium, fontSize: 12, lineHeight: 18 },
  languagePill: { backgroundColor: 'rgba(79,69,229,0.35)', paddingHorizontal: spacing.md, paddingVertical: 3, borderRadius: radius.full, maxWidth: '35%' },
  language: { color: colors.primaryPale, fontFamily: fonts.monoBold, fontSize: 10, lineHeight: 12, letterSpacing: 0 },
  body: { paddingVertical: spacing.lg, paddingLeft: spacing.md, paddingRight: 14, backgroundColor: '#1f2333', gap: spacing.xxs },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  number: { width: 18, textAlign: 'right', fontFamily: fonts.mono, fontSize: 12, lineHeight: 20, color: '#626782', includeFontPadding: false },
  content: { flex: 1, minWidth: 0 },
  code: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 20, color: colors.onSurfaceCode, includeFontPadding: false },
});
