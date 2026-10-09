
/**
 * Mock data for academic progress and practice history.
 *
 * Feature: progress-history
 *
 * Course and subtopic information is reused from
 * the existing develop branch.
 *
 * Practice attempts are simulated to reproduce
 * the examples shown in Figma.
 *
 * @packageDocumentation
 */

import { COURSES, SUBTOPICS } from './courses.mock';

import type {
    AcademicProgress,
    CourseProgress,
    HistoryFilter,
    PracticeHistory,
    PracticeHistoryItem,
    PracticeHistorySummary,
    PracticeRecommendation,
    SubtopicProgress,
    WeakSubtopic,
} from '../types/progress';

// --------------------------------------------------
// Academic progress
// --------------------------------------------------

export const MOCK_PROGRESS_COURSE_ID = 'course-1';

export const MOCK_SUBTOPIC_EXERCISE_COUNTS: Record<
    string,
    { correct: number; total: number }
> = {
    'sub-1': { correct: 14, total: 18 },
    'sub-2': { correct: 12, total: 14 },
    'sub-3': { correct: 5, total: 10 },
    'sub-4': { correct: 0, total: 0 },
};

export function createCourseProgress(
    courseId: string,
    empty = false,
): AcademicProgress {
    const course = COURSES.find(
        item => item.id === courseId,
    );

    if (!course) {
        throw new Error(`Course ${courseId} not found`);
    }

    const courseSubtopics = SUBTOPICS.filter(
        item => item.courseId === courseId,
    );

    const subtopics: SubtopicProgress[] =
        courseSubtopics.map(subtopic => {
            const counts =
                MOCK_SUBTOPIC_EXERCISE_COUNTS[subtopic.id];

            return {
                subtopic,
                mastery: empty ? null : subtopic.mastery,
                correctExerciseCount: empty
                    ? 0
                    : counts?.correct ?? 0,
                totalExerciseCount: empty
                    ? 0
                    : counts?.total ?? 0,
                isPracticed: !empty && subtopic.mastery !== null,
            };
        });

    const practicedSubtopicCount = subtopics.filter(
        item => item.isPracticed,
    ).length;

    const mastery = empty ? null : course.mastery;

    const level =
        mastery === null
            ? 'not_started'
            : mastery >= 80
                ? 'advanced'
                : mastery >= 50
                    ? 'intermediate'
                    : 'basic';

    const levelLabel =
        level === 'advanced'
            ? 'Avanzado'
            : level === 'intermediate'
                ? 'Intermedio Avanzado'
                : level === 'basic'
                    ? 'En desarrollo'
                    : 'Sin estimación';

    const courseProgress: CourseProgress = {
        course,
        mastery,
        solvedExerciseCount: empty
            ? 0
            : course.solvedExerciseCount,
        practicedSubtopicCount,
        totalSubtopicCount: courseSubtopics.length,
        level,
        levelLabel,
        isEmpty: empty || mastery === null,
    };

    const weakest = empty
        ? undefined
        : subtopics
            .filter(item => item.mastery !== null)
            .sort(
                (a, b) =>
                    (a.mastery ?? 0) - (b.mastery ?? 0),
            )[0];

    let weakSubtopic: WeakSubtopic | null = null;

    if (weakest && weakest.mastery !== null) {
        weakSubtopic = {
            subtopicId: weakest.subtopic.id,
            courseId,
            name: weakest.subtopic.name,
            mastery: weakest.mastery,
            recommendedExerciseCount: 9,
            description:
                'Recomendamos 9 ejercicios guiados hoy para consolidar memoización y formulación de estados.',
        };
    }

    return {
        courseProgress,
        subtopics,
        weakSubtopic,
    };
}

export const MOCK_ACADEMIC_PROGRESS =
    createCourseProgress(MOCK_PROGRESS_COURSE_ID);

export const MOCK_EMPTY_ACADEMIC_PROGRESS =
    createCourseProgress(MOCK_PROGRESS_COURSE_ID, true);

// --------------------------------------------------
// Practice history
// --------------------------------------------------

/**
 * Visible examples from the Figma mockup.
 * These are demonstration records, not backend data.
 */
export const MOCK_HISTORY_ITEMS: PracticeHistoryItem[] = [
    {
        id: 'attempt-1',
        exerciseId: 'exercise-1',
        courseId: 'course-1',
        subtopicId: 'sub-1',
        subtopicName: 'Recursividad y Backtracking',
        exerciseTitle:
            'Evaluación de función recursiva misterio(n)',
        outcome: 'correct',
        completedAt: '2025-05-09T10:45:00',
        durationSeconds: 102,
        reviewPending: false,
    },
    {
        id: 'attempt-2',
        exerciseId: 'exercise-2',
        courseId: 'course-1',
        subtopicId: 'sub-3',
        subtopicName: 'Programación Dinámica',
        exerciseTitle:
            'Matriz de subsecuencia común más larga (LCS)',
        outcome: 'incorrect',
        completedAt: '2025-05-09T16:20:00',
        durationSeconds: 250,
        reviewPending: true,
    },
    {
        id: 'attempt-3',
        exerciseId: 'exercise-3',
        courseId: 'course-1',
        subtopicId: 'sub-2',
        subtopicName: 'Árboles Binarios de Búsqueda',
        exerciseTitle:
            'Rotación simple a la derecha en árbol AVL',
        outcome: 'correct',
        completedAt: '2025-05-12T18:05:00',
        durationSeconds: 0,
        reviewPending: false,
    },
];

/**
 * The Figma dashboard represents 42 attempts:
 * 31 correct and 11 to review.
 *
 * Only three individual example records are
 * available in the mockup. The remaining
 * attempts are represented by aggregate totals.
 */
export const MOCK_HISTORY_TOTALS = {
    all: 42,
    correct: 31,
    review: 11,
} as const;

export const MOCK_HISTORY_RECOMMENDATION:
    PracticeRecommendation = {
    title: 'Consejo de práctica espaciada',
    description:
        'Repasar los ejercicios incorrectos antes de 48 horas incrementa la retención del patrón algorítmico hasta un 70%.',
    targetAccuracy: 70,
};

export const MOCK_HISTORY_SUMMARY:
    PracticeHistorySummary = {
    totalAttempts: MOCK_HISTORY_TOTALS.all,
    correctAttempts: MOCK_HISTORY_TOTALS.correct,
    incorrectAttempts: MOCK_HISTORY_TOTALS.review,
    accuracyPercentage: 74,
    counts: {
        all: MOCK_HISTORY_TOTALS.all,
        correct: MOCK_HISTORY_TOTALS.correct,
        review: MOCK_HISTORY_TOTALS.review,
    },
};

export const MOCK_EMPTY_HISTORY_SUMMARY:
    PracticeHistorySummary = {
    totalAttempts: 0,
    correctAttempts: 0,
    incorrectAttempts: 0,
    accuracyPercentage: null,
    counts: {
        all: 0,
        correct: 0,
        review: 0,
    },
};

export function createPracticeHistory(
    filter: HistoryFilter = 'all',
    empty = false,
): PracticeHistory {
    if (empty) {
        return {
            summary: MOCK_EMPTY_HISTORY_SUMMARY,
            items: [],
            recommendation: null,
            isEmpty: true,
        };
    }

    const items = MOCK_HISTORY_ITEMS.filter(item => {
        if (filter === 'correct') {
            return item.outcome === 'correct';
        }

        if (filter === 'review') {
            return item.reviewPending;
        }

        return true;
    });

    return {
        summary: MOCK_HISTORY_SUMMARY,
        items,
        recommendation:
            filter === 'correct' || filter === 'review'
                ? MOCK_HISTORY_RECOMMENDATION
                : null,
        isEmpty: false,
    };
}

export const MOCK_PRACTICE_HISTORY =
    createPracticeHistory();

export const MOCK_CORRECT_HISTORY =
    createPracticeHistory('correct');

export const MOCK_REVIEW_HISTORY =
    createPracticeHistory('review');

export const MOCK_EMPTY_PRACTICE_HISTORY =
    createPracticeHistory('all', true);
