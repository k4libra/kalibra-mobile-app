/**
 * Splits generated statements into display-only prose and code blocks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { StatementSegment } from '@/types/exercise';

// Conservative line-level markers avoid classifying prose with inline code as a code block.
function isCodeLine(line: string): boolean {
  const text = line.trim();
  return /^(?:for|while|if|switch|catch)\s*\(/.test(text)
    || /^(?:def|class|function)\s+\w+/.test(text)
    || /^(?:for|while|if|elif|else|try|except)\b.*:\s*$/.test(text)
    || /^(?:public|private|protected|static|int|long|float|double|boolean|char|String|void|const|let|var)\s+[^\s]+.*[;{=]/.test(text)
    || /^(?:return|break|continue|throw)\b.*;\s*$/.test(text)
    || /^(?:[}\]]\s*[;,){}]*|}\s*else(?:\s+if\s*\(.*\))?\s*{|else\s*{)\s*$/.test(text)
    || /^[\w.$]+\s*(?:\([^;]*\)|(?:\+\+|--|[+*/-]?=).*)\s*;\s*$/.test(text)
    || /^(?:print|console\.log|System\.out\.print(?:ln)?)\s*\(/.test(text);
}

/**
 * Separates fenced, indented and recognizable code lines while preserving block order.
 *
 * @remarks
 * Source is treated only as text and is never evaluated. Unclosed fences consume the remaining
 * lines as code. Unmarked code has no inferred language or file name.
 *
 * @param statement - Generator output, optionally containing Markdown code fences.
 * @returns Ordered prose and code segments with code indentation preserved.
 *
 * @example
 * ```ts
 * splitStatement('Evaluate:\n    return 1;')[1].type; // 'code'
 * ```
 */
export function splitStatement(statement: string): StatementSegment[] {
  if (!statement.trim()) return [];
  const lines = statement.replace(/\r\n?/g, '\n').split('\n');
  const segments: StatementSegment[] = [];
  let buffer: string[] = [];
  let kind: 'prose' | 'code' = 'prose';
  let fence: string | null = null;
  let language = '';

  const flush = () => {
    // Trim blank boundary lines, keeping all indentation and internal whitespace of source lines.
    while (buffer.length && !buffer[0].trim()) buffer.shift();
    while (buffer.length && !buffer[buffer.length - 1].trim()) buffer.pop();
    if (buffer.length) {
      const text = buffer.join('\n');
      segments.push(kind === 'prose'
        ? { type: 'prose', text }
        : { type: 'code', snippet: { source: text, fileName: '', language } });
    }
    buffer = [];
  };

  for (const line of lines) {
    const marker = line.match(/^\s*(`{3,}|~{3,})\s*([^\s`]*)\s*$/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2]) {
        flush();
        fence = null;
        kind = 'prose';
        language = '';
      } else buffer.push(line);
      continue;
    }
    if (marker) {
      flush();
      fence = marker[1];
      language = marker[2];
      kind = 'code';
      continue;
    }
    if (!line.trim()) {
      buffer.push(line);
      continue;
    }
    const isIndented: boolean = /^(?: {4}|\t)/.test(line) || (kind === 'code' && /^\s+\S/.test(line));
    const nextKind: 'prose' | 'code' = isCodeLine(line) || isIndented ? 'code' : 'prose';
    if (nextKind !== kind) {
      flush();
      kind = nextKind;
    }
    buffer.push(line);
  }
  flush();
  return segments;
}
