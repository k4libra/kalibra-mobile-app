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
    || /^(?:print|console\.log|System\.out\.print(?:ln)?)\s*\(/.test(text)
    || /^(?:(?:public|private|protected|internal|abstract|sealed|static|final)\s+)*(?:ref\s+|value\s+)?(?:class|struct|interface|enum)\s+\w+/.test(text)
    || /^(?:public|private|protected|internal)\s*:$/.test(text)
    || /^(?:#include\b|using\s+namespace\b|import\s+[\w.]+)/.test(text)
    || (!/^¿/.test(text) && /[;{]$/.test(text));
}

// A sentence that introduces or asks about the code stays prose even between code lines.
function isSentence(line: string): boolean {
  return /^¿|[.?!:]$/.test(line.trim()) && !/^(?:public|private|protected|internal)\s*:$/.test(line.trim());
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
function splitCodeStatement(statement: string): StatementSegment[] {
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

  // Unfenced code arrives as one region: lines between two code lines join it unless they are
  // sentences, so a snippet is never split into alternating prose and code blocks.
  const codeLike = lines.map(line => !!line.trim() && (isCodeLine(line) || /^(?: {4}|\t)/.test(line)));
  const firstCode = codeLike.indexOf(true);
  const lastCode = codeLike.lastIndexOf(true);
  const inRegion = (index: number) => firstCode >= 0 && index > firstCode && index < lastCode
    && !!lines[index].trim() && !isSentence(lines[index]);

  for (const [index, line] of lines.entries()) {
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
    const nextKind: 'prose' | 'code' = isCodeLine(line) || isIndented || inRegion(index) ? 'code' : 'prose';
    if (nextKind !== kind) {
      flush();
      kind = nextKind;
    }
    buffer.push(line);
  }
  flush();
  return segments;
}

/**
 * Protects explicit code and math blocks before applying indentation heuristics to prose.
 * Inline single-dollar math remains with its prose for the rich-text renderer.
 */
export function splitStatement(statement: string): StatementSegment[] {
  const input = statement.replace(/\r\n?/g, '\n');
  const segments: StatementSegment[] = [];
  const tokens = /^[ \t]*(`{3,}|~{3,})[ \t]*([^\s`]*)[ \t]*$|\$\$|\\\[|^[ \t]*\\\(/gm;
  let pendingStart = 0;
  let match: RegExpExecArray | null;
  const flushProse = (end: number) => segments.push(...splitCodeStatement(input.slice(pendingStart, end)));

  while ((match = tokens.exec(input))) {
    if (match[1]) {
      const fence = match[1];
      const language = match[2];
      const bodyStart = tokens.lastIndex + (input[tokens.lastIndex] === '\n' ? 1 : 0);
      const closing = /^[ \t]*(`{3,}|~{3,})[ \t]*$/gm;
      closing.lastIndex = bodyStart;
      let closingMatch: RegExpExecArray | null;
      let bodyEnd = input.length;
      let blockEnd = input.length;
      while ((closingMatch = closing.exec(input))) {
        if (closingMatch[1][0] === fence[0] && closingMatch[1].length >= fence.length) {
          bodyEnd = closingMatch.index;
          blockEnd = closing.lastIndex;
          break;
        }
      }
      flushProse(match.index);
      const lines = input.slice(bodyStart, bodyEnd).split('\n');
      while (lines.length && !lines[0].trim()) lines.shift();
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      if (lines.length) {
        const source = lines.join('\n');
        segments.push(/^(?:math|latex|tex)$/i.test(language)
          ? { type: 'formula', source: source.trim() }
          : { type: 'code', snippet: { source, fileName: '', language } });
      }
      pendingStart = blockEnd;
      tokens.lastIndex = blockEnd;
      continue;
    }

    const opener = match[0].trim();
    const closer = opener === '$$' ? '$$' : opener === '\\[' ? '\\]' : '\\)';
    const bodyStart = tokens.lastIndex;
    const bodyEnd = input.indexOf(closer, bodyStart);
    if (bodyEnd < 0) continue;
    const blockEnd = bodyEnd + closer.length;
    // Parenthesized math is a separate block only when it occupies its whole line.
    if (opener === '\\(' && input.slice(blockEnd, input.indexOf('\n', blockEnd) < 0 ? input.length : input.indexOf('\n', blockEnd)).trim()) continue;
    flushProse(match.index);
    const source = input.slice(bodyStart, bodyEnd).trim();
    if (source) segments.push({ type: 'formula', source });
    pendingStart = blockEnd;
    tokens.lastIndex = blockEnd;
  }
  flushProse(input.length);
  return segments;
}
