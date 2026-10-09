
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { usePracticeHistory } from '../hooks/usePracticeHistory';

import type {
    HistoryFilter,
    PracticeHistoryItem,
} from '../types/progress';

interface HistoryScreenProps {
    onBack?: () => void;
    onOpenExercise?: (exerciseId: string) => void;
}

const FILTERS: {
    value: HistoryFilter;
    label: string;
}[] = [
    { value: 'all', label: 'Todos' },
    { value: 'correct', label: 'Correctos' },
    { value: 'review', label: 'Para repasar' },
];

export function HistoryScreen({
                                  onBack,
                                  onOpenExercise,
                              }: HistoryScreenProps) {
    const {
        history,
        filter,
        setFilter,
        isLoading,
        error,
        refreshHistory,
        isEmptyPreview,
        setEmptyPreview,
    } = usePracticeHistory();

    const summary = history?.summary;

    const renderExercise = (item: PracticeHistoryItem) => {
        const correct = item.outcome === 'correct';

        return (
            <View key={item.id} style={styles.exerciseCard}>
                <View style={styles.exerciseRow}>
                    <View
                        style={[
                            styles.resultIcon,
                            {
                                backgroundColor: correct
                                    ? '#E7F8F1'
                                    : '#FFF4E4',
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: correct ? '#27AE83' : '#E89B31',
                                fontWeight: '800',
                                fontSize: 18,
                            }}
                        >
                            {correct ? '✓' : '↻'}
                        </Text>
                    </View>

                    <View style={styles.exerciseContent}>
                        <Text style={styles.exerciseTitle}>
                            {item.exerciseTitle}
                        </Text>

                        <Text style={styles.exerciseSubtitle}>
                            {item.subtopicName}
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.resultText,
                            {
                                color: correct ? '#27AE83' : '#E89B31',
                            },
                        ]}
                    >
                        {correct ? 'Correcto' : 'Repasar'}
                    </Text>
                </View>

                {onOpenExercise ? (
                    <Pressable
                        style={styles.exerciseAction}
                        onPress={() => onOpenExercise(item.exerciseId)}
                    >
                        <Text style={styles.actionText}>
                            Ver ejercicio →
                        </Text>
                    </Pressable>
                ) : null}
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                {onBack ? (
                    <Pressable
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </Pressable>
                ) : null}

                <View>
                    <Text style={styles.headerTitle}>
                        Historial de prácticas
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Revisa tu actividad académica
                    </Text>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>
                    Resumen de prácticas
                </Text>

                <Text style={styles.sectionSubtitle}>
                    Revisa tus resultados y avances
                </Text>

                <View style={styles.statsGrid}>
                    {[
                        {
                            label: 'Intentos realizados',
                            value: summary?.totalAttempts ?? 0,
                            color: '#6C5CE7',
                        },
                        {
                            label: 'Correctos',
                            value: summary?.correctAttempts ?? 0,
                            color: '#27AE83',
                        },
                        {
                            label: 'Para repasar',
                            value: summary?.incorrectAttempts ?? 0,
                            color: '#E89B31',
                        },
                        {
                            label: 'Precisión',
                            value:
                                summary?.accuracyPercentage == null
                                    ? '--'
                                    : `${Math.round(
                                        summary.accuracyPercentage,
                                    )}%`,
                            color: '#3875D7',
                        },
                    ].map(stat => (
                        <View key={stat.label} style={styles.statCard}>
                            <Text
                                style={[
                                    styles.statValue,
                                    { color: stat.color },
                                ]}
                            >
                                {stat.value}
                            </Text>

                            <Text style={styles.statLabel}>
                                {stat.label}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>
                    Historial de ejercicios
                </Text>

                <View style={styles.filterRow}>
                    {FILTERS.map(option => {
                        const selected = filter === option.value;

                        return (
                            <Pressable
                                key={option.value}
                                onPress={() => setFilter(option.value)}
                                style={[
                                    styles.filterButton,
                                    selected && styles.activeFilter,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        selected && styles.activeFilterText,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#6C5CE7"
                        style={styles.loading}
                    />
                ) : error ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            Error al cargar el historial
                        </Text>

                        <Text style={styles.emptyDescription}>
                            {error}
                        </Text>

                        <Pressable
                            style={styles.retryButton}
                            onPress={refreshHistory}
                        >
                            <Text style={styles.retryText}>
                                Reintentar
                            </Text>
                        </Pressable>
                    </View>
                ) : history && history.items.length > 0 ? (
                    history.items.map(renderExercise)
                ) : (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>◇</Text>

                        <Text style={styles.emptyTitle}>
                            {filter === 'correct'
                                ? 'Sin respuestas correctas'
                                : filter === 'review'
                                    ? 'Sin ejercicios para repasar'
                                    : 'Todavía no tienes prácticas'}
                        </Text>

                        <Text style={styles.emptyDescription}>
                            Los ejercicios que realices
                            aparecerán aquí para que puedas
                            consultar tus resultados.
                        </Text>
                    </View>
                )}

                {history?.recommendation ? (
                    <View style={styles.recommendationCard}>
                        <Text style={styles.recommendationTitle}>
                            {history.recommendation.title}
                        </Text>

                        <Text style={styles.recommendationText}>
                            {history.recommendation.description}
                        </Text>
                    </View>
                ) : null}

                {__DEV__ ? (
                    <Pressable
                        style={styles.previewButton}
                        onPress={() => setEmptyPreview(!isEmptyPreview)}
                    >
                        <Text style={styles.previewText}>
                            {isEmptyPreview
                                ? 'Mostrar historial con datos'
                                : 'Vista previa: historial vacío'}
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
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ECEEFA',
    },
    backButton: {
        marginRight: 14,
    },
    backText: {
        fontSize: 32,
        color: '#141A33',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#141A33',
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
        paddingBottom: 40,
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
        marginBottom: 18,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ECEEFA',
        padding: 18,
        marginBottom: 12,
    },
    statValue: {
        fontSize: 27,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 11,
        color: '#747B90',
        marginTop: 7,
    },
    filterRow: {
        flexDirection: 'row',
        marginTop: 18,
        marginBottom: 18,
    },
    filterButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ECEEFA',
        paddingHorizontal: 12,
        paddingVertical: 11,
        marginRight: 8,
    },
    activeFilter: {
        backgroundColor: '#6C5CE7',
        borderColor: '#6C5CE7',
    },
    filterText: {
        color: '#747B90',
        fontSize: 12,
        fontWeight: '700',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    loading: {
        marginTop: 30,
    },
    exerciseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ECEEFA',
        padding: 16,
        marginBottom: 12,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    exerciseContent: {
        flex: 1,
    },
    exerciseTitle: {
        color: '#141A33',
        fontSize: 13,
        fontWeight: '700',
    },
    exerciseSubtitle: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 5,
    },
    resultText: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 8,
    },
    exerciseAction: {
        alignItems: 'flex-end',
        marginTop: 14,
    },
    actionText: {
        color: '#6C5CE7',
        fontSize: 11,
        fontWeight: '700',
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 26,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 40,
        color: '#6C5CE7',
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#141A33',
        textAlign: 'center',
    },
    emptyDescription: {
        color: '#747B90',
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 10,
    },
    retryButton: {
        backgroundColor: '#6C5CE7',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 16,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    recommendationCard: {
        backgroundColor: '#F0EDFF',
        borderRadius: 16,
        padding: 18,
        marginTop: 12,
    },
    recommendationTitle: {
        color: '#6C5CE7',
        fontSize: 14,
        fontWeight: '800',
    },
    recommendationText: {
        color: '#555B73',
        fontSize: 12,
        lineHeight: 19,
        marginTop: 8,
    },
    previewButton: {
        alignItems: 'center',
        marginTop: 20,
        padding: 14,
    },
    previewText: {
        color: '#9499AA',
        fontSize: 11,
        textDecorationLine: 'underline',
    },
});
