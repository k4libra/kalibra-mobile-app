/**
 * Tests display-only splitting of generator prose and code.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { splitStatement } from './statement';

test('preserves ordinary prose and inline code as prose', () => {
  const text = 'Analiza `for` y la función f(n).\n¿Cuál es la respuesta?';
  expect(splitStatement(text)).toEqual([{ type: 'prose', text }]);
});

test('extracts fenced code with its supplied language and surrounding prose in order', () => {
  const source = 'for (int i = 0; i < n; i++) {\n  total += i;\n}';
  expect(splitStatement(`Evalúa el código:\n\`\`\`java\n${source}\n\`\`\`\n¿Cuánto vale total?`)).toEqual([
    { type: 'prose', text: 'Evalúa el código:' },
    { type: 'code', snippet: { source, language: 'java', fileName: '' } },
    { type: 'prose', text: '¿Cuánto vale total?' },
  ]);
});

test('extracts an unfenced C-style loop without inventing source metadata', () => {
  const source = 'for (int i = 0; i < n; i++) {\n    total += i;\n}';
  expect(splitStatement(`Considera:\n${source}\n¿Cuál es su complejidad?`)).toEqual([
    { type: 'prose', text: 'Considera:' },
    { type: 'code', snippet: { source, language: '', fileName: '' } },
    { type: 'prose', text: '¿Cuál es su complejidad?' },
  ]);
});

test('preserves indentation, internal blank lines and tabs in code', () => {
  const source = '    value = 1\n\n\tprint(value)';
  expect(splitStatement(`Calcula:\n${source}\nRespuesta:`)[1]).toMatchObject({
    type: 'code', snippet: { source },
  });
});

test('keeps two-space Python bodies and C-style else branches together', () => {
  const python = 'for i in range(n):\n  total += i\n  # Keep accumulating';
  expect(splitStatement(`Evalúa:\n${python}\n¿Cuánto retorna?`)[1]).toMatchObject({ snippet: { source: python } });
  const c = 'if (n > 0) {\n  return n;\n} else {\n  return 0;\n}';
  expect(splitStatement(c)).toHaveLength(1);
  expect(splitStatement(c)[0]).toMatchObject({ type: 'code', snippet: { source: c } });
});

test('keeps multiple code blocks separated by prose', () => {
  expect(splitStatement('Primero:\n~~~python\nprint(1)\n~~~\nDespués:\n```\nprint(2)\n```').map(block => block.type)).toEqual([
    'prose', 'code', 'prose', 'code',
  ]);
});

test('handles empty statements and empty fenced blocks', () => {
  expect(splitStatement(' \n\t')).toEqual([]);
  expect(splitStatement('```\n\n```')).toEqual([]);
});

test('treats an unclosed fence as code through the end and never evaluates its content', () => {
  const source = 'globalThis.statementWasEvaluated = true;';
  expect(splitStatement(`Texto\n\`\`\`js\n${source}`)[1]).toEqual({
    type: 'code', snippet: { source, language: 'js', fileName: '' },
  });
  expect('statementWasEvaluated' in globalThis).toBe(false);
});

test('normalizes Windows line endings without altering code indentation', () => {
  expect(splitStatement('Código:\r\n```\r\n  return 1;\r\n```')[1]).toMatchObject({
    snippet: { source: '  return 1;' },
  });
});

test('keeps indented display math together instead of treating formula rows as code', () => {
  const source = '\\begin{bmatrix}\n    1 & 2 \\\\\n    3 & 4\n\\end{bmatrix}';
  expect(splitStatement(`Considera:\n$$\n${source}\n$$\n¿Cuál es su rango?`)).toEqual([
    { type: 'prose', text: 'Considera:' }, { type: 'formula', source }, { type: 'prose', text: '¿Cuál es su rango?' },
  ]);
});

test.each(['math', 'latex', 'tex'])('renders %s fences as formulas while preserving their source', language => {
  expect(splitStatement(`\`\`\`${language}\n\\frac{1}{2}\n\`\`\``)).toEqual([{ type: 'formula', source: '\\frac{1}{2}' }]);
});

test('does not parse mathematical delimiters inside actual code fences', () => {
  const source = 'const literal = "$$x^2$$";';
  expect(splitStatement(`\`\`\`js\n${source}\n\`\`\``)).toEqual([{ type: 'code', snippet: { source, language: 'js', fileName: '' } }]);
});

test('recognizes bracket math and standalone inline-math notation without losing prose', () => {
  expect(splitStatement('Antes\n\\[ x^2 \\]\nDespués').map(segment => segment.type)).toEqual(['prose', 'formula', 'prose']);
  expect(splitStatement('\\(x^2\\)')).toEqual([{ type: 'formula', source: 'x^2' }]);
});

test('keeps an unfenced C++/CLI class as one code block between its prose lines', () => {
  const statement = [
    'Dada la siguiente clase en C++/CLI:',
    '',
    'ref class Cuenta {',
    'private:',
    '    int saldo;',
    'public:',
    '    Cuenta(int s) { saldo = s; }',
    '    void Depositar(int m) { saldo += m; }',
    '};',
    '',
    '¿Qué valor retorna ObtenerSaldo tras depositar 50?',
  ].join('\n');

  const segments = splitStatement(statement);

  expect(segments.map(segment => segment.type)).toEqual(['prose', 'code', 'prose']);
  expect(segments[1].type === 'code' && segments[1].snippet.source.split('\n')[0]).toBe('ref class Cuenta {');
  expect(segments[1].type === 'code' && segments[1].snippet.source.split('\n').at(-1)).toBe('};');
});
