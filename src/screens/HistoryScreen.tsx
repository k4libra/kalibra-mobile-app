
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
import {
    HistorySummary,
    HistoryFilters,
    HistoryExerciseCard,
} from '../components/progress';

interface HistoryScreenProps {
    onBack?: () => void;
    onOpenExercise?: (exerciseId: string) => void;
}

export function HistoryScreen({
                                  onBack,
                                  onOpenExercise,
                              }: HistoryScreenProps) {
    const {
        history,
        filter,
        isLoading,
        error,
        isEmptyPreview,
        setFilter,
        setEmptyPreview,
        refreshHistory,
    } = usePracticeHistory();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                {onBack ? (
                    <Pressable onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </Pressable>
                ) : null}

                <View style={styles.headerText}>
                    <Text style={styles.title}>Mi historial</Text>
                    <Text style={styles.subtitle}>
                        Consulta tus ejercicios realizados
                    </Text>
                </View>
            </View>

            {__DEV__ ? (
                <Pressable
                    onPress={() => setEmptyPreview(!isEmptyPreview)}
                    style={styles.previewButton}
                >
                    <Text style={styles.previewText}>
                        {isEmptyPreview
                            ? 'Ver historial con datos'
                            : 'Ver estado vacío'}
                    </Text>
                </Pressable>
            ) : null}

            {isLoading && !history ? (
                <ActivityIndicator
                    size="large"
                    color="#6C5CE7"
                    style={styles.loading}
                />
            ) : null}

            {error ? (
                <View style={styles.messageCard}>
                    <Text style={styles.messageTitle}>
                        No se pudo cargar el historial
                    </Text>
                    <Text style={styles.messageText}>{error}</Text>

                    <Pressable onPress={refreshHistory}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </Pressable>
                </View>
            ) : null}

            {history && !error ? (
                <>
                    <HistorySummary summary={history.summary} />

                    <HistoryFilters
                        filter={filter}
                        onChange={setFilter}
                        counts={history.summary.counts}
                        disabled={isLoading}
                    />

                    {history.items.length > 0 ? (
                        history.items.map(item => (
                            <HistoryExerciseCard
                                key={item.id}
                                item={item}
                                onOpenExercise={onOpenExercise}
                            />
                        ))
                    ) : (
                        <View style={styles.messageCard}>
                            <Text style={styles.emptyIcon}>◇</Text>

                            <Text style={styles.messageTitle}>
                                {history.isEmpty
                                    ? 'Aún no tienes prácticas'
                                    : 'No hay ejercicios en este filtro'}
                            </Text>

                            <Text style={styles.messageText}>
                                {history.isEmpty
                                    ? 'Cuando resuelvas ejercicios, aparecerán aquí tus resultados.'
                                    : 'Prueba seleccionando otro filtro para consultar tus ejercicios.'}
                            </Text>
                        </View>
                    )}

                    {history.recommendation ? (
                        <View style={styles.recommendation}>
                            <Text style={styles.recommendationTitle}>
                                Recomendación
                            </Text>
                            <Text style={styles.recommendationText}>
                                {JSON.stringify(history.recommendation)}
                            </Text>
                        </View>
                    ) : null}
                </>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FC',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 14,
        padding: 8,
    },
    backText: {
        fontSize: 25,
        color: '#141A33',
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#141A33',
    },
    subtitle: {
        fontSize: 12,
        color: '#747B90',
        marginTop: 5,
    },
    previewButton: {
        alignSelf: 'flex-end',
        marginBottom: 18,
    },
    previewText: {
        color: '#6C5CE7',
        fontSize: 12,
        fontWeight: '700',
    },
    loading: {
        marginTop: 50,
    },
    messageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ECEEFA',
        padding: 25,
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyIcon: {
        fontSize: 36,
        color: '#6C5CE7',
        marginBottom: 12,
    },
    messageTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#141A33',
        textAlign: 'center',
    },
    messageText: {
        fontSize: 12,
        color: '#747B90',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 19,
    },
    retryText: {
        color: '#6C5CE7',
        fontWeight: '700',
        marginTop: 15,
    },
    recommendation: {
        backgroundColor: '#F0EDFF',
        borderRadius: 16,
        padding: 18,
        marginTop: 10,
    },
    recommendationTitle: {
        color: '#5143B8',
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 8,
    },
    recommendationText: {
        color: '#555B73',
        fontSize: 12,
        lineHeight: 19,
    },
});
