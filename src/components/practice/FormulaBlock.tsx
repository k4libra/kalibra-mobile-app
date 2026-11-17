/** Read-only mathematical notation in STIX Two Text. */
import React from 'react';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { Text } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

export interface FormulaBlockProps {
  /** Supplied expression; no numerical result or domain is synthesized. */
  source: string;
}

const SYMBOLS: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ', mu: 'μ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  int: '∫', iint: '∬', iiint: '∭', oint: '∮', sum: '∑', prod: '∏', infty: '∞', partial: '∂', nabla: '∇',
  cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', equiv: '≡',
  in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', superset: '⊃', supseteq: '⊇', cup: '∪', cap: '∩', emptyset: '∅', perp: '⊥', parallel: '∥',
  to: '→', rightarrow: '→', leftarrow: '←', mapsto: '↦', Rightarrow: '⇒', Leftrightarrow: '⇔', forall: '∀', exists: '∃',
  ldots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱', langle: '⟨', rangle: '⟩', lVert: '‖', rVert: '‖', vert: '|', Vert: '‖',
  sin: 'sin', cos: 'cos', tan: 'tan', log: 'log', ln: 'ln', exp: 'exp', lim: 'lim', det: 'det', dim: 'dim', ker: 'ker', rank: 'rank', max: 'max', min: 'min',
};
const BLACKBOARD: Record<string, string> = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', P: 'ℙ' };
const SUPER: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', n: 'ⁿ', i: 'ⁱ', x: 'ˣ', y: 'ʸ', a: 'ᵃ', b: 'ᵇ', k: 'ᵏ', m: 'ᵐ', t: 'ᵗ' };
const SUB: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎', a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ' };

function groupAt(source: string, start: number) {
  let index = start;
  while (/\s/.test(source[index] ?? '') && index < source.length) index += 1;
  if (source[index] !== '{') return null;
  let depth = 1;
  let end = index + 1;
  while (end < source.length && depth > 0) {
    if (source[end] === '\\') { end += 2; continue; }
    if (source[end] === '{') depth += 1;
    if (source[end] === '}') depth -= 1;
    end += 1;
  }
  return depth === 0 ? { value: source.slice(index + 1, end - 1), end } : null;
}

/** Reads one TeX script atom, including an unbraced command such as _\Omega. */
function scriptAt(source: string, start: number) {
  let index = start;
  while (index < source.length && /\s/.test(source[index])) index += 1;
  const group = groupAt(source, index);
  if (group) return { value: readableFormula(group.value), end: group.end };
  if (source[index] === '{') return null;
  if (source[index] === '\\') {
    const command = /^\\([A-Za-z]+|.)/s.exec(source.slice(index));
    if (!command) return null;
    let end = index + command[0].length;
    const count = /^(?:dfrac|tfrac|frac)$/.test(command[1]) ? 2
      : /^(?:sqrt|mathbb|mathbf|mathrm|mathit|mathcal|text|operatorname|boldsymbol|vec|hat|overline)$/.test(command[1]) ? 1 : 0;
    for (let argument = 0; argument < count; argument += 1) {
      const next = groupAt(source, end);
      if (!next) break;
      end = next.end;
    }
    return { value: readableFormula(source.slice(index, end)), end };
  }
  const value = [...source.slice(index)][0];
  return value ? { value, end: index + value.length } : null;
}

/** Converts supported TeX notation without evaluating, correcting or dropping unknown commands. */
export function readableFormula(source: string): string {
  const input = source.trim().replace(/^(?:\$\$|\\\[|\\\()/, '').replace(/(?:\$\$|\\\]|\\\))$/, '').replace(/^\$(.*)\$$/s, '$1');
  let result = '';
  let index = 0;
  while (index < input.length) {
    const char = input[index];
    if (char === '^' || char === '_') {
      const script = scriptAt(input, index + 1);
      if (!script) { result += input.slice(index); break; }
      const alphabet = char === '^' ? SUPER : SUB;
      result += [...script.value].every(letter => alphabet[letter]) ? [...script.value].map(letter => alphabet[letter]).join('') : `${char}(${script.value})`;
      index = script.end;
      continue;
    }
    if (char !== '\\') { result += char; index += 1; continue; }
    const command = /^\\([A-Za-z]+|.)/s.exec(input.slice(index));
    if (!command) { result += char; index += 1; continue; }
    const name = command[1];
    const end = index + command[0].length;
    if (name === 'left' || name === 'right' || name === 'displaystyle' || name === 'textstyle') { index = end; continue; }
    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
      const numerator = groupAt(input, end);
      const denominator = numerator && groupAt(input, numerator.end);
      if (numerator && denominator) {
        const a = readableFormula(numerator.value);
        const b = readableFormula(denominator.value);
        result += `${a.length > 1 ? `(${a})` : a}⁄${b.length > 1 ? `(${b})` : b}`;
        index = denominator.end;
        continue;
      }
    }
    if (name === 'sqrt') {
      const radicand = groupAt(input, end);
      if (radicand) { result += `√(${readableFormula(radicand.value)})`; index = radicand.end; continue; }
    }
    if (['mathbb', 'mathbf', 'mathrm', 'mathit', 'mathcal', 'text', 'operatorname', 'boldsymbol', 'vec', 'hat', 'overline'].includes(name)) {
      const group = groupAt(input, end);
      if (group) {
        const text = readableFormula(group.value);
        result += name === 'mathbb' ? BLACKBOARD[text] ?? text : name === 'vec' ? `${text}⃗` : name === 'hat' ? `${text}̂` : name === 'overline' ? `${text}̅` : text;
        index = group.end;
        continue;
      }
    }
    if (SYMBOLS[name]) result += SYMBOLS[name];
    else if (name === ',' || name === ';' || name === ':') result += ' ';
    else if (name === 'quad') result += '　';
    else if (name === 'qquad') result += '　　';
    else if (name === ' ') result += ' ';
    else if (name === '!') result += '';
    else if ('{}%&#_$'.includes(name)) result += name;
    else result += command[0];
    index = end;
  }
  return result;
}

/** Renders common matrix environments structurally; unfamiliar notation remains readable source. */
export function FormulaBlock({ source }: FormulaBlockProps) {
  const expression = readableFormula(source);
  const domain = /ℝ[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱˣʸᵏᵐ]*/.exec(expression)?.[0];
  const matrix = /\\begin\{([pbvV]?matrix)\}([\s\S]*?)\\end\{\1\}/.exec(source);
  return (
    <View accessibilityLabel={source} style={styles.block}>
      <View style={styles.pill}>
        <Text variant="bodyM" color="secondary">{domain ? 'Definido en' : 'Expresión matemática'}</Text>
        {domain && <NativeText style={styles.domain}>{domain}</NativeText>}
      </View>
      {matrix ? (
        <View style={styles.matrixExpression}>
          {source.slice(0, matrix.index).trim() !== '' && <NativeText style={styles.expression}>{readableFormula(source.slice(0, matrix.index))}</NativeText>}
          <View style={styles.matrix}>
            {matrix[1] !== 'matrix' && <View style={[styles.delimiter, matrix[1] === 'Vmatrix' ? styles.doubleBar : styles.leftBar, matrix[1] === 'pmatrix' && styles.leftParenthesis, matrix[1] === 'bmatrix' && styles.leftBracket]} />}
            <View style={styles.matrixBody}>
              {matrix[2].split(/\\\\/).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.matrixRow}>
                  {row.split('&').map((cell, cellIndex) => <NativeText key={cellIndex} style={[styles.expression, styles.cell]}>{readableFormula(cell.trim())}</NativeText>)}
                </View>
              ))}
            </View>
            {matrix[1] !== 'matrix' && <View style={[styles.delimiter, matrix[1] === 'Vmatrix' ? styles.doubleBar : styles.rightBar, matrix[1] === 'pmatrix' && styles.rightParenthesis, matrix[1] === 'bmatrix' && styles.rightBracket]} />}
          </View>
          {source.slice(matrix.index + matrix[0].length).trim() !== '' && <NativeText style={styles.expression}>{readableFormula(source.slice(matrix.index + matrix[0].length))}</NativeText>}
        </View>
      ) : <NativeText style={[styles.expression, styles.center]}>{expression}</NativeText>}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { minHeight: 94, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primaryContainerSoft, backgroundColor: colors.primarySubtle, paddingHorizontal: spacing.xl, paddingVertical: 14, gap: 10, justifyContent: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: spacing.sm, paddingHorizontal: 10, paddingVertical: spacing.xs, backgroundColor: colors.white, borderRadius: radius.full },
  domain: { fontFamily: fonts.formula, color: colors.primary, fontSize: 14, lineHeight: 18 },
  expression: { fontFamily: fonts.formula, color: colors.contentPrimary, fontSize: 20, lineHeight: 28, includeFontPadding: false },
  center: { textAlign: 'center' },
  matrixExpression: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  matrix: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.xs },
  matrixBody: { paddingVertical: spacing.xs },
  delimiter: { width: 7, borderColor: colors.contentPrimary },
  leftBar: { borderLeftWidth: 1.2 },
  rightBar: { borderRightWidth: 1.2 },
  doubleBar: { width: 5, borderLeftWidth: 1.2, borderRightWidth: 1.2 },
  leftParenthesis: { borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  rightParenthesis: { borderTopRightRadius: 14, borderBottomRightRadius: 14 },
  leftBracket: { borderTopWidth: 1.2, borderBottomWidth: 1.2 },
  rightBracket: { borderTopWidth: 1.2, borderBottomWidth: 1.2 },
  matrixRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  cell: { minWidth: 20, textAlign: 'center' },
});
