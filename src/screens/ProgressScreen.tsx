
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { COURSES } from '../mocks/courses.mock';
import { MOCK_PROGRESS_COURSE_ID } from '../mocks/progress.mock';

import { useProgress } from '../hooks/useProgress';

import { CourseSelector } from '../components/progress/CourseSelector';
import { ProgressOverview } from '../components/progress/ProgressOverview';
import { SubtopicProgressCard } from '../components/progress/SubtopicProgressCard';
import { WeakSubtopicCard } from '../components/progress/WeakSubtopicCard';

interface ProgressScreenProps {
    onBack?: () => void;
    onPractice?: (
        courseId: string,
        subtopicId: string,
    ) => void;
    onOpenHistory?: () => void;
}

export function ProgressScreen({
                                   onBack,
                                   onPractice,
                                   onOpenHistory,
                               }: ProgressScreenProps) {
    const {
        progress,
        selectedCourseId,
        isLoading,
        error,
        isEmptyPreview,
        selectCourse,
        setEmptyPreview,
        refreshProgress,
    } = useProgress(MOCK_PROGRESS_COURSE_ID);

    const handlePractice = (
        courseId: string,
        subtopicId: string,
    ) => {
        if (onPractice) {
            onPractice(courseId, subtopicId);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    {onBack ? (
                        <Pressable
                            onPress={onBack}
                            style={styles.backButton}
                            accessibilityRole="button"
                            accessibilityLabel="Volver"
                        >
                            <Text style={styles.backIcon}>‹</Text>
                        </Pressable>
                    ) : null}

                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>
                            Mi progreso
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            Sigue tu evolución académica
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <CourseSelector
                    courses={COURSES}
                    selectedCourseId={selectedCourseId}
                    onSelectCourse={selectCourse}
                    disabled={isLoading}
                />

                {isLoading ? (
                    <View style={styles.feedbackContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#6C5CE7"
                        />

                        <Text style={styles.feedbackText}>
                            Cargando tu progreso...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.errorTitle}>
                            No pudimos cargar tu progreso
                        </Text>

                        <Text style={styles.feedbackText}>
                            {error}
                        </Text>

                        <Pressable
                            style={styles.retryButton}
                            onPress={refreshProgress}
                        >
                            <Text style={styles.retryText}>
                                Reintentar
                            </Text>
                        </Pressable>
                    </View>
                ) : progress ? (
                    <>
                        <ProgressOverview
                            progress={progress.courseProgress}
                        />

                        {!progress.courseProgress.isEmpty ? (
                            <>
                                {progress.weakSubtopic ? (
                                    <WeakSubtopicCard
                                        recommendation={progress.weakSubtopic}
                                        onPractice={handlePractice}
                                        disabled={!onPractice}
                                    />
                                ) : null}

                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>
                                        Progreso por subtema
                                    </Text>

                                    <Text style={styles.sectionSubtitle}>
                                        Conoce tu dominio en cada tema
                                    </Text>
                                </View>

                                {progress.subtopics.map(item => (
                                    <SubtopicProgressCard
                                        key={item.subtopic.id}
                                        progress={item}
                                    />
                                ))}
                            </>
                        ) : (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyIcon}>
                                    ◇
                                </Text>

                                <Text style={styles.emptyTitle}>
                                    Tu progreso comienza aquí
                                </Text>

                                <Text style={styles.emptyDescription}>
                                    Practica ejercicios de tus cursos
                                    para comenzar a visualizar tus
                                    avances y recibir recomendaciones
                                    personalizadas.
                                </Text>
                            </View>
                        )}

                        {onOpenHistory ? (
                            <Pressable
                                style={styles.historyButton}
                                onPress={onOpenHistory}
                                accessibilityRole="button"
                            >
                                <Text style={styles.historyButtonText}>
                                    Ver historial de prácticas
                                </Text>

                                <Text style={styles.historyArrow}>
                                    →
                                </Text>
                            </Pressable>
                        ) : null}
                    </>
                ) : null}

                {__DEV__ ? (
                    <Pressable
                        style={styles.previewButton}
                        onPress={() => setEmptyPreview(!isEmptyPreview)}
                    >
                        <Text style={styles.previewText}>
                            {isEmptyPreview
                                ? 'Mostrar progreso con datos'
                                : 'Vista previa: sin progreso'}
                        </Text>
                    </Pressable>
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F7F8FC',
    },

    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ECEEFA',
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        marginRight: 8,
    },

    backIcon: {
        color: '#141A33',
        fontSize: 34,
        lineHeight: 36,
    },

    headerContent: {
        flex: 1,
    },

    headerTitle: {
        color: '#141A33',
        fontSize: 23,
        fontWeight: '800',
    },

    headerSubtitle: {
        color: '#747B90',
        fontSize: 12,
        marginTop: 5,
    },

    scroll: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 36,
    },

    feedbackContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 28,
        alignItems: 'center',
        marginTop: 12,
    },

    feedbackText: {
        color: '#747B90',
        fontSize: 12,
        lineHeight: 19,
        textAlign: 'center',
        marginTop: 14,
    },

    errorTitle: {
        color: '#141A33',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },

    retryButton: {
        backgroundColor: '#6C5CE7',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 18,
    },

    retryText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    sectionHeader: {
        marginTop: 28,
        marginBottom: 16,
    },

    sectionTitle: {
        color: '#141A33',
        fontSize: 18,
        fontWeight: '800',
    },

    sectionSubtitle: {
        color: '#747B90',
        fontSize: 12,
        marginTop: 5,
    },

    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 18,
        padding: 26,
        alignItems: 'center',
        marginTop: 20,
    },

    emptyIcon: {
        color: '#6C5CE7',
        fontSize: 40,
        marginBottom: 12,
    },

    emptyTitle: {
        color: '#141A33',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
    },

    emptyDescription: {
        color: '#747B90',
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 10,
    },

    historyButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E0FF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    historyButtonText: {
        color: '#6C5CE7',
        fontSize: 13,
        fontWeight: '700',
    },

    historyArrow: {
        color: '#6C5CE7',
        fontSize: 20,
    },

    previewButton: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 20,
    },

    previewText: {
        color: '#9499AA',
        fontSize: 11,
        textDecorationLine: 'underline',
    },
});
