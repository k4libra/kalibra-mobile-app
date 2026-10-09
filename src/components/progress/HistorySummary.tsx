
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PracticeHistorySummary } from '../../types/progress';

interface HistorySummaryProps {
    summary: PracticeHistorySummary;
}

export function HistorySummary({ summary }: HistorySummaryProps) {
    const stats = [
        {
            label: 'Intentos realizados',
            value: String(summary.totalAttempts),
            color: '#6C5CE7',
            background: '#F0EDFF',
            icon: '≡',
        },
        {
            label: 'Correctos',
            value: String(summary.correctAttempts),
            color: '#27AE83',
            background: '#E7F8F1',
            icon: '✓',
        },
        {
            label: 'Para repasar',
            value: String(summary.incorrectAttempts),
            color: '#E89B31',
            background: '#FFF4E4',
            icon: '↻',
        },
        {
            label: 'Precisión',
            value:
                summary.accuracyPercentage === null
                    ? '--'
                    : `${Math.round(summary.accuracyPercentage)}%`,
            color: '#3875D7',
            background: '#EAF2FF',
            icon: '%',
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumen de prácticas</Text>
            <Text style={styles.subtitle}>
                Revisa tus resultados y avances
            </Text>

            <View style={styles.grid}>
                {stats.map(stat => (
                    <View key={stat.label} style={styles.card}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: stat.background },
                            ]}
                        >
                            <Text style={[styles.icon, { color: stat.color }]}>
                                {stat.icon}
                            </Text>
                        </View>

                        <Text style={styles.value}>{stat.value}</Text>
                        <Text style={styles.label}>{stat.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 22,
    },
    title: {
        color: '#141A33',
        fontSize: 18,
        fontWeight: '800',
    },
    subtitle: {
        color: '#747B90',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        minHeight: 140,
    },
    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 19,
        fontWeight: '800',
    },
    value: {
        color: '#141A33',
        fontSize: 27,
        fontWeight: '800',
    },
    label: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 5,
    },
});
