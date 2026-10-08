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
  /** Position of the exercise in the session, starting at 1. */
  position: number;
  /** Exercises in the session. */
  sessionSize: number;
  /** Points earned in the session so far. */
  sessionPoints: number;
  /** Time spent in the session, for example `01:42`. */
  elapsed: string;
  /** Statement before the code. */
  prompt: RichTextSegment[];
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
  /** Position of the step, starting at 1. */
  order: number;
  /** Code or expression evaluated in the step. */
  expression: string;
  /** Short label at the end of the step, for example `Marco #1`. */
  tag: string;
  /** What happens in the step. */
  description: string;
  /** Whether the step is the key one (for example the base case). */
  isKey: boolean;
}

/**
 * Describes the outcome of an answer with its explanation and mastery change.
 */
export interface PracticeResult {
  /** Identifier of the recorded answer. */
  attemptId: string;
  /** Exercise answered. */
  exerciseId: string;
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
  position: number;
  /** Exercises in the session. */
  sessionSize: number;
  /** Results of the previous exercises of the session, in order. */
  sessionOutcomes: boolean[];
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
