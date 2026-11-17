/**
 * Domain types of the adaptive practice of a student.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Piece of a sentence; `code` pieces are rendered as inline code.
 */
export interface RichTextSegment {
  /** Text of the piece. */
  text: string;
  /** Whether the piece is inline code. */
  isCode?: boolean;
}

/**
 * Describes a code snippet shown with an exercise.
 */
export interface CodeSnippet {
  /** File name shown in the editor bar, for example `misterio.py`. */
  fileName: string;
  /** Language label, for example `PYTHON 3`. */
  language: string;
  /** Source code. */
  source: string;
}

/** Ordered prose and code blocks extracted from a generated statement. */
export type StatementSegment =
  | { type: 'formula'; source: string }
  | {
      /** Prose block discriminator. */
      type: 'prose';
      /** Original prose. */
      text: string;
    }
  | {
      /** Code block discriminator. */
      type: 'code';
      /** Display-only source and supplied language. */
      snippet: CodeSnippet;
    };

/**
 * Describes one answer option.
 */
export interface AnswerOption {
  /** Unique identifier of the option. */
  id: string;
  /** Letter shown before the option, for example `A`. */
  letter: string;
  /** Answer value. */
  value: string;
  /** Short note under the value. */
  hint: string;
}

/**
 * Describes an exercise generated for the current level of the student.
 */
export interface PracticeExercise {
  /** Original server difficulty, preserved for calibration presentation. */
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  /** Unique identifier assigned by the server. */
  id: string;
  /** Course of the exercise. */
  courseId: string;
  /** Subtopic of the exercise. */
  subtopicId: string;
  /** Name of the subtopic. */
  subtopicName: string;
  /** Area label of the problem card, for example `ALGORITMOS & ESTRUCTURAS`. */
  area: string;
  /** Level label, for example `NIVEL INTERMEDIO`. */
  levelLabel: string;
  /** Adaptive difficulty label, for example `Dificultad adaptativa: Nivel 2`. */
  difficultyLabel: string;
  /** Position in the local visit, populated by the practice hook. */
  position: number | null;
  /** Local visit size, populated by the practice hook. */
  sessionSize: number | null;
  /** Session points, or null when not supplied by the API. */
  sessionPoints: number | null;
  /** Time spent in the session, for example `01:42`. */
  elapsed: string;
  /** Statement before the code. */
  prompt: RichTextSegment[];
  /** Statement blocks in their original order, including embedded code. */
  statementSegments: StatementSegment[];
  /** Code snippet of the exercise; `null` when there is none. */
  code: CodeSnippet | null;
  /** Question the student answers. */
  question: RichTextSegment[];
  /** Answer options in display order. */
  options: AnswerOption[];
  /** Optional hint the student can reveal. */
  hint: string;
}

/**
 * Describes one step of the explanation of an exercise.
 */
export interface ExplanationStep {
  /** Short supplied step title. */
  title: string;
  /** Supplied prose, source code or mathematical expression. */
  detail: string;
  /** Rendering chosen by the API. */
  kind: 'TEXT' | 'CODE' | 'FORMULA';
}

/**
 * Describes the outcome of an answer with its explanation and mastery change.
 */
export interface PracticeResult {
  /** Exact resulting mastery returned by the server for the next guided exercise. */
  currentMastery?: number;
  /** Submitted option from the API or the account-scoped exercise cache. */
  selectedAnswer?: { letter: string; value: string };
  /** Optional verified answer, only when provided by the API. */
  correctAnswer?: { letter: string; value: string };
  /** Identifier of the recorded answer. */
  attemptId: string;
  /** Exercise identifier; null when recovering a history entry without it. */
  exerciseId: string | null;
  /** Course of the exercise. */
  courseId: string;
  /** Subtopic of the exercise. */
  subtopicId: string;
  /** Name of the subtopic. */
  subtopicName: string;
  /** Whether the answer was correct. */
  isCorrect: boolean;
  /** Feedback sentence under the headline. */
  message: string;
  /** Change of the subtopic mastery in points; `0` when it did not change. */
  masteryDelta: number;
  /** Position of the exercise in the session. */
  position: number | null;
  /** Session size, or null when the API does not report sessions. */
  sessionSize: number | null;
  /** Results of the previous exercises of the session, in order. */
  sessionOutcomes: boolean[];
  /** Full explanation from the server, without synthesized steps. */
  explanation: string;
  /** Main learning point supplied by the API. */
  keyIdea?: string | null;
  /** Short label of the explanation, for example `Pila LIFO`. */
  explanationTag: string;
  /** Steps of the explanation. */
  steps: ExplanationStep[];
  /** Label of the final summary, for example `Desenrollado total:`. */
  summaryLabel: string;
  /** Final expression of the summary. */
  summaryValue: string;
  /** Title of the learning tip. */
  tipTitle: string;
  /** Body of the learning tip. */
  tipBody: string;
}
