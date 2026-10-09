
/**
 * Academic progress overview card.
 *
 * Feature: progress-history
 *
 * Displays the course mastery indicator,
 * solved exercises and learning level.
 *
 * @packageDocumentation
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { CourseProgress } from '../../types/progress';
import { MasteryRing } from './MasteryRing';

interface ProgressOverviewProps {
    progress: CourseProgress;
}

export function ProgressOverview({
                                     progress,
                                 }: ProgressOverviewProps) {
    const {
        mastery,
        solvedExerciseCount,
        practicedSubtopicCount,
        totalSubtopicCount,
        levelLabel,
        isEmpty,
    } = progress;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Dominio académico
                </Text>

                <Text style={styles.subtitle}>
                    Tu avance en el curso seleccionado
                </Text>
            </View>

            <View style={styles.ringContainer}>
                <MasteryRing
                    mastery={mastery}
                    size={164}
                    strokeWidth={13}
                />

                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>
                        {isEmpty ? 'Sin estimación' : levelLabel}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {solvedExerciseCount}
                    </Text>

                    <Text style={styles.statLabel}>
                        Ejercicios resueltos
                    </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {practicedSubtopicCount}
                        <Text style={styles.statTotal}>
                            /{totalSubtopicCount}
                        </Text>
                    </Text>

                    <Text style={styles.statLabel}>
                        Subtemas practicados
                    </Text>
                </View>
            </View>

            {isEmpty ? (
                <View style={styles.emptyMessage}>
                    <Text style={styles.emptyTitle}>
                        Aún no tenemos datos suficientes
                    </Text>

                    <Text style={styles.emptyDescription}>
                        Resuelve tus primeros ejercicios para
                        comenzar a estimar tu dominio académico.
                    </Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 20,
    },

    header: {
        alignItems: 'center',
    },

    title: {
        color: '#141A33',
        fontSize: 17,
        fontWeight: '800',
        textAlign: 'center',
    },

    subtitle: {
        color: '#747B90',
        fontSize: 12,
        marginTop: 6,
        textAlign: 'center',
    },

    ringContainer: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 24,
    },

    levelBadge: {
        backgroundColor: '#F0EDFF',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
        marginTop: 16,
    },

    levelText: {
        color: '#6C5CE7',
        fontSize: 11,
        fontWeight: '700',
    },

    divider: {
        height: 1,
        backgroundColor: '#ECEEFA',
        marginBottom: 18,
    },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    stat: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 6,
    },

    statValue: {
        color: '#141A33',
        fontSize: 25,
        fontWeight: '800',
    },

    statTotal: {
        color: '#A2A7BA',
        fontSize: 17,
        fontWeight: '600',
    },

    statLabel: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 6,
        textAlign: 'center',
    },

    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#ECEEFA',
    },

    emptyMessage: {
        backgroundColor: '#F8F7FF',
        borderRadius: 12,
        padding: 14,
        marginTop: 20,
    },

    emptyTitle: {
        color: '#141A33',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },

    emptyDescription: {
        color: '#747B90',
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
        marginTop: 6,
    },
});
