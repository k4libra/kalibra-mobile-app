
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    PracticeHistoryItem,
} from '../../types/progress';

interface HistoryExerciseCardProps {
    item: PracticeHistoryItem;
    onOpenExercise?: (exerciseId: string) => void;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatDuration(seconds: number): string {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function HistoryExerciseCard({
                                        item,
                                        onOpenExercise,
                                    }: HistoryExerciseCardProps) {
    const isCorrect = item.outcome === 'correct';

    const statusColor = isCorrect
        ? '#27AE83'
        : '#E89B31';

    const statusBackground = isCorrect
        ? '#E7F8F1'
        : '#FFF4E4';

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: statusBackground },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusIcon,
                            { color: statusColor },
                        ]}
                    >
                        {isCorrect ? '✓' : '↻'}
                    </Text>
                </View>

                <View style={styles.headerContent}>
                    <Text
                        style={styles.exerciseTitle}
                        numberOfLines={2}
                    >
                        {item.exerciseTitle}
                    </Text>

                    <Text
                        style={styles.subtopicName}
                        numberOfLines={1}
                    >
                        {item.subtopicName}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusBackground },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: statusColor },
                        ]}
                    >
                        {isCorrect ? 'Correcto' : 'Repasar'}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
                <View style={styles.detail}>
                    <Text style={styles.detailLabel}>
                        Fecha
                    </Text>

                    <Text style={styles.detailValue}>
                        {formatDate(item.completedAt)}
                    </Text>
                </View>

                <View style={styles.detail}>
                    <Text style={styles.detailLabel}>
                        Duración
                    </Text>

                    <Text style={styles.detailValue}>
                        {formatDuration(item.durationSeconds)}
                    </Text>
                </View>
            </View>

            {onOpenExercise ? (
                <Pressable
                    onPress={() => onOpenExercise(item.exerciseId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver ejercicio ${item.exerciseTitle}`}
                    style={({ pressed }) => [
                        styles.actionButton,
                        pressed && styles.actionPressed,
                    ]}
                >
                    <Text style={styles.actionText}>
                        Ver ejercicio
                    </Text>

                    <Text style={styles.actionArrow}>
                        →
                    </Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    statusIcon: {
        fontSize: 20,
        fontWeight: '800',
    },

    headerContent: {
        flex: 1,
        paddingRight: 8,
    },

    exerciseTitle: {
        color: '#141A33',
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 19,
    },

    subtopicName: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 5,
    },

    statusBadge: {
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 6,
    },

    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },

    divider: {
        height: 1,
        backgroundColor: '#ECEEFA',
        marginVertical: 14,
    },

    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    detail: {
        flex: 1,
    },

    detailLabel: {
        color: '#9499AA',
        fontSize: 10,
        marginBottom: 4,
    },

    detailValue: {
        color: '#555B73',
        fontSize: 11,
        fontWeight: '600',
    },

    actionButton: {
        backgroundColor: '#F0EDFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    actionPressed: {
        opacity: 0.8,
    },

    actionText: {
        color: '#6C5CE7',
        fontSize: 12,
        fontWeight: '800',
    },

    actionArrow: {
        color: '#6C5CE7',
        fontSize: 17,
        marginLeft: 8,
    },
});
