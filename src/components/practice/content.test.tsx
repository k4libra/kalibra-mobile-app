import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ScrollView } from 'react-native';
import { CodeBlock, tokenizeCodeLine } from './CodeBlock';
import { FormulaBlock, readableFormula } from './FormulaBlock';
import { ExplanationCard } from './ExplanationCard';
import { mapResult } from '@/services/mappers/practice';
import { TEST_ATTEMPTS, TEST_COURSES } from '@/test/apiFixtures';

test.each([
  '    return misterio(n - 2) # conserva espacios',
  '\tconst café = "sin ejecutar"; // comentario',
  'if (x <= 0xFF) return 1.25e-3;',
  'print("una cadena sin cierre',
])('syntax coloring preserves every source character: %s', source => {
  expect(tokenizeCodeLine(source).tokens.map(token => token.text).join('')).toBe(source);
});

test('continues block comments across lines and resumes syntax coloring after closing', () => {
  const first = tokenizeCodeLine('/* inicio');
  expect(first.inComment).toBe(true);
  expect(first.tokens).toEqual([{ text: '/* inicio', kind: 'comment' }]);
  const second = tokenizeCodeLine('fin */ return 2;', first.inComment);
  expect(second.inComment).toBe(false);
  expect(second.tokens.map(token => token.text).join('')).toBe('fin */ return 2;');
  expect(second.tokens).toEqual(expect.arrayContaining([
    { text: 'fin */', kind: 'comment' },
    { text: 'return', kind: 'keyword' },
    { text: '2', kind: 'number' },
  ]));
});

test('renders all line numbers, original accessible source and supplied metadata without horizontal clipping', async () => {
  const source = 'def inorden(nodo):\n    if nodo is None:\n        return []\n    return inorden(nodo.izq) + [nodo.val] + inorden(nodo.der)';
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<CodeBlock snippet={{ source, fileName: 'arbol.py', language: 'Python' }} />); });
    const root = tree!.root;
    expect(root.findAll(node => node.props.accessibilityLabel === source).length).toBeGreaterThan(0);
    for (const lineNumber of [1, 2, 3, 4]) expect(root.findAll(node => String(node.type) === 'Text' && node.props.children === lineNumber)).toHaveLength(1);
    expect(root.findAll(node => String(node.type) === 'Text' && node.props.children === 'arbol.py')).toHaveLength(1);
    expect(root.findAll(node => String(node.type) === 'Text' && node.props.children === 'Python')).toHaveLength(1);
    expect(root.findAllByType(ScrollView)).toHaveLength(0);
  } finally { await ReactTestRenderer.act(async () => { tree?.unmount(); }); }
});

test('uses an honest generic header when source metadata is absent', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<CodeBlock snippet={{ source: 'return 1', fileName: '', language: '' }} />); });
    expect(tree!.root.findAll(node => String(node.type) === 'Text' && node.props.children === 'Código')).toHaveLength(2);
    expect(JSON.stringify(tree!.toJSON())).not.toContain('.py');
  } finally { await ReactTestRenderer.act(async () => { tree?.unmount(); }); }
});

test.each([
  ['F(x,y) = x^{2}y + xy^{2}', 'F(x,y) = x²y + xy²'],
  ['\\mathbb{R}^{3}', 'ℝ³'],
  ['\\frac{a+b}{c+d}', '(a+b)⁄(c+d)'],
  ['\\frac{1}{\\frac{2}{3}}', '1⁄(2⁄3)'],
  ['\\sqrt{x^{2}+y^{2}}', '√(x²+y²)'],
  ['\\oint_C F \\cdot dr', '∮_(C) F · dr'],
  ['x^{p+q}', 'x^(p+q)'],
  ['\\unknown{42}', '\\unknown{42}'],
  ['\\frac{1}{', '\\frac{1}{'],
  ['\\[u, v \\in \\mathbb{R}^{n}, u \\perp v\\]', 'u, v ∈ ℝⁿ, u ⊥ v'],
])('converts supported notation without changing mathematical values: %s', (source, expected) => {
  expect(readableFormula(source)).toBe(expected);
});

test('renders matrix values structurally and keeps the original expression accessible', async () => {
  const source = 'A = \\begin{pmatrix}2 & 0 \\\\ 0 & 3\\end{pmatrix}';
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<FormulaBlock source={source} />); });
    const root = tree!.root;
    expect(root.findAll(node => node.props.accessibilityLabel === source).length).toBeGreaterThan(0);
    const text = root.findAll(node => String(node.type) === 'Text').map(node => node.props.children);
    expect(text).toEqual(expect.arrayContaining(['A =', '2', '0', '0', '3']));
    expect(text).toContain('Expresión matemática');
    expect(text).not.toContain('Definido en');
  } finally { await ReactTestRenderer.act(async () => { tree?.unmount(); }); }
});

test('shows a domain label only when the supplied expression identifies it', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<FormulaBlock source="u ∈ ℝ³" />); });
    const text = tree!.root.findAll(node => String(node.type) === 'Text').map(node => node.props.children);
    expect(text).toContain('Definido en');
    expect(text).toContain('ℝ³');
    expect(text).toContain('u ∈ ℝ³');
  } finally { await ReactTestRenderer.act(async () => { tree?.unmount(); }); }
});

test.each([
  ['x^\\alpha', 'x^(α)'],
  ['\\int_\\Omega', '∫_(Ω)'],
  ['x^\\mathbb{R}', 'x^(ℝ)'],
])('keeps complete macro arguments in scripts: %s', (source, expected) => {
  expect(readableFormula(source)).toBe(expected);
});

test('keeps legacy explanation paragraphs, code and mathematics when structured steps are absent', async () => {
  const result = mapResult({ ...TEST_ATTEMPTS[0], explanation: 'Primero identifica los datos.\n\nLuego calcula la suma.\n```python\nprint(9)\n```\n$$5 + 3 + 1 = 9$$', explanationSteps: null }, TEST_COURSES[0]);
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<ExplanationCard result={result} />); });
    const text = tree!.root.findAll(node => String(node.type) === 'Text').map(node => [node.props.children].flat().join(''));
    expect(text).toEqual(expect.arrayContaining(['Primero identifica los datos.', 'Luego calcula la suma.']));
    expect(tree!.root.findByType(CodeBlock).props.snippet).toMatchObject({ source: 'print(9)', language: 'python' });
    expect(tree!.root.findByType(FormulaBlock).props.source).toBe('5 + 3 + 1 = 9');
  } finally { await ReactTestRenderer.act(async () => { tree?.unmount(); }); }
});
