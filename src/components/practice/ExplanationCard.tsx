import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Icon, IconBox, Text } from '@/components/ui';
import { colors } from '@/theme/tokens';
import type { ExplanationStep, PracticeResult, StatementSegment } from '@/types/exercise';
import { splitStatement } from '@/utils/statement';
import { CodeBlock } from './CodeBlock';
import { FormulaBlock } from './FormulaBlock';
import { RichText } from './RichText';
export interface ExplanationCardProps { result: PracticeResult }
/** Display structure follows actual paragraphs/code/math; no solution steps are invented. */
export function ExplanationCard({ result }: ExplanationCardProps) {
  const steps = result.steps.length > 0
    ? result.steps.map(step => ({ title: step.title, blocks: stepBlocks(step) }))
    : explanationBlocks(result.explanation).map(block => ({ title: '', blocks: [block] }));
  return <>
    <Card style={styles.card}>
      <View style={styles.header}><IconBox icon="terminal" size="md" />
        <Text variant="title" style={styles.flex} isHeading>Explicación paso a paso</Text>
        <Chip label={result.explanationTag || 'Desglose'} icon="layers" tone="neutral" />
      </View>
      {steps.map((step, index) => <View key={index} style={styles.step}>
        <View style={styles.order}><Text variant="bodyMBold" color="brand">{index + 1}</Text></View>
        <View style={styles.flex}>
          {step.title ? <Text variant="labelL">{step.title}</Text> : null}
          {step.blocks.map((block, blockIndex) => <ExplanationBlock key={blockIndex} block={block} />)}
        </View>
      </View>)}
      <View style={styles.summary}><Icon name={result.summaryValue ? 'functions' : result.isCorrect ? 'check_circle' : 'help'} />
        <Text variant="labelL" style={styles.flex}>{result.summaryLabel || 'Resultado registrado'}</Text>
        <Text variant="bodyMBold" color="brand">{result.summaryValue || (result.isCorrect ? 'Correcto' : 'Para repasar')}</Text>
      </View>
    </Card>
    <View style={styles.tip}><IconBox icon="lightbulb" tone="neutral" size="md" />
      <View style={styles.flex}><Text variant="labelL" color="warning">{result.keyIdea ? 'Idea clave' : result.tipTitle || 'Clave de aprendizaje'}</Text>
        <Text variant="bodyM">{result.keyIdea || result.tipBody || 'Compara tu respuesta con la explicación y vuelve a practicar para reforzar lo aprendido.'}</Text></View>
    </View>
  </>;
}
/** Keeps legacy prose short while preserving supplied code and formula blocks. */
function explanationBlocks(explanation: string): StatementSegment[] {
  return splitStatement(explanation).flatMap<StatementSegment>(segment => segment.type === 'prose'
    ? segment.text.split(/\n\s*\n/).filter(Boolean).map(text => ({ type: 'prose', text })) : [segment]);
}
function stepBlocks(step: ExplanationStep): StatementSegment[] {
  if (step.kind === 'CODE') {
    // Fenced details retain their language; unmarked source is still rendered as code.
    if (/^\s*(`{3,}|~{3,})/.test(step.detail)) return splitStatement(step.detail);
    return [{ type: 'code', snippet: { source: step.detail, fileName: '', language: '' } }];
  }
  if (step.kind === 'FORMULA') {
    const blocks = splitStatement(step.detail);
    return blocks.some(block => block.type === 'formula') ? blocks : [{ type: 'formula', source: step.detail }];
  }
  return explanationBlocks(step.detail);
}
function ExplanationBlock({ block }: { block: StatementSegment }) {
  return block.type === 'code' ? <CodeBlock snippet={block.snippet} />
    : block.type === 'formula' ? <FormulaBlock source={block.source} /> : <RichText segments={[{ text: block.text }]} variant="bodyM" />;
}
const styles = StyleSheet.create({ card: { gap: 12 }, header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  flex: { flex: 1, minWidth: 0, gap: 4 }, step: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 16, backgroundColor: colors.primarySubtle },
  order: { width: 28, height: 28, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, backgroundColor: colors.primaryContainerSoft },
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 24, backgroundColor: colors.tertiarySubtle } });
