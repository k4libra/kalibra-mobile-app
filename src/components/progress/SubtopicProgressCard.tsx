
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { SubtopicProgress } from '../../types/progress';

interface SubtopicProgressCardProps {
    progress: SubtopicProgress;
}

export function SubtopicProgressCard({
                                         progress,
                                     }: SubtopicProgressCardProps) {
    const {
        subtopic,
        mastery,
        correctExerciseCount,
        totalExerciseCount,
        isPracticed,
    } = progress;

    const percentage =
        mastery !== null && Number.isFinite(mastery)
            ? Math.max(0, Math.min(100, mastery))
            : 0;

    const getProgressColor = () => {
        if (!isPracticed) {
            return '#C8CBD8';
        }

        if (percentage >= 75) {
            return '#27AE83';
        }

        if (percentage >= 50) {
            return '#6C5CE7';
        }

        return '#F2A93B';
    };

    const getLevelLabel = () => {
        if (!isPracticed) {
            return 'Sin practicar';
        }

        if (percentage >= 75) {
            return 'Avanzado';
        }

        if (percentage >= 50) {
            return 'Intermedio';
        }

        return 'Necesita refuerzo';
    };

    const progressColor = getProgressColor();

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {subtopic.name}
                    </Text>

                    <Text style={styles.exerciseCount}>
                        {isPracticed
                            ? `${correctExerciseCount} de ${totalExerciseCount} ejercicios correctos`
                            : 'Aún no has practicado este subtema'}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.percentage,
                        { color: progressColor },
                    ]}
                >
                    {isPracticed
                        ? `${Math.round(percentage)}%`
                        : '--'}
                </Text>
            </View>

            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${percentage}%`,
                            backgroundColor: progressColor,
                        },
                    ]}
                />
            </View>

            <View style={styles.footer}>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: isPracticed
                                ? '#F2EFFF'
                                : '#F3F4F8',
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: progressColor },
                        ]}
                    />

                    <Text
                        style={[
                            styles.statusText,
                            {
                                color: isPracticed
                                    ? '#6C5CE7'
                                    : '#747B90',
                            },
                        ]}
                    >
                        {getLevelLabel()}
                    </Text>
                </View>

                <Text style={styles.masteryLabel}>
                    Dominio del subtema
                </Text>
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },

    titleContainer: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        color: '#141A33',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,
    },

    exerciseCount: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 6,
    },

    percentage: {
        fontSize: 20,
        fontWeight: '800',
    },

    progressTrack: {
        height: 8,
        backgroundColor: '#ECEEFA',
        borderRadius: 8,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 8,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },

    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },

    masteryLabel: {
        color: '#9499AA',
        fontSize: 10,
    },
});
