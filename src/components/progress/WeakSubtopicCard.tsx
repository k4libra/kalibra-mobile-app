
/**
 * Weak subtopic recommendation card.
 *
 * Feature: progress-history
 *
 * Displays the subtopic that requires
 * reinforcement and a practice action.
 *
 * @packageDocumentation
 */

import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    WeakSubtopic,
} from '../../types/progress';

interface WeakSubtopicCardProps {
    recommendation: WeakSubtopic;
    onPractice: (
        courseId: string,
        subtopicId: string,
    ) => void;
    disabled?: boolean;
}

export function WeakSubtopicCard({
                                     recommendation,
                                     onPractice,
                                     disabled = false,
                                 }: WeakSubtopicCardProps) {
    const {
        courseId,
        subtopicId,
        name,
        mastery,
        recommendedExerciseCount,
        description,
    } = recommendation;

    const percentage = Math.max(
        0,
        Math.min(100, mastery),
    );

    const handlePractice = () => {
        onPractice(courseId, subtopicId);
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>✦</Text>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.eyebrow}>
                        REFUERZO RECOMENDADO
                    </Text>

                    <Text style={styles.title}>
                        ¡Puedes mejorar aquí!
                    </Text>
                </View>
            </View>

            <View style={styles.subtopicContainer}>
                <View style={styles.subtopicHeader}>
                    <Text
                        style={styles.subtopicName}
                        numberOfLines={2}
                    >
                        {name}
                    </Text>

                    <Text style={styles.masteryValue}>
                        {Math.round(percentage)}%
                    </Text>
                </View>

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${percentage}%` },
                        ]}
                    />
                </View>

                <Text style={styles.masteryLabel}>
                    Dominio actual
                </Text>
            </View>

            <Text style={styles.description}>
                {description}
            </Text>

            <Pressable
                onPress={handlePractice}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Practicar ${name}`}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    disabled && styles.buttonDisabled,
                ]}
            >
                <Text style={styles.buttonText}>
                    Practicar ahora
                </Text>

                <Text style={styles.buttonArrow}>
                    →
                </Text>
            </Pressable>

            <Text style={styles.footer}>
                {recommendedExerciseCount} ejercicios recomendados
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#6C5CE7',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    icon: {
        color: '#FFFFFF',
        fontSize: 24,
    },

    headerContent: {
        flex: 1,
    },

    eyebrow: {
        color: '#DDD7FF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 4,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
    },

    subtopicContainer: {
        backgroundColor: 'rgba(255,255,255,0.13)',
        borderRadius: 14,
        padding: 14,
    },

    subtopicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    subtopicName: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        paddingRight: 12,
    },

    masteryValue: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
    },

    progressTrack: {
        height: 7,
        borderRadius: 7,
        backgroundColor: 'rgba(255,255,255,0.25)',
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 7,
        backgroundColor: '#FFFFFF',
    },

    masteryLabel: {
        color: '#DDD7FF',
        fontSize: 10,
        marginTop: 8,
    },

    description: {
        color: '#F2EFFF',
        fontSize: 12,
        lineHeight: 19,
        marginTop: 18,
        marginBottom: 18,
    },

    button: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        minHeight: 46,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonPressed: {
        backgroundColor: '#F0EDFF',
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: '#6C5CE7',
        fontSize: 13,
        fontWeight: '800',
    },

    buttonArrow: {
        color: '#6C5CE7',
        fontSize: 19,
        marginLeft: 8,
    },

    footer: {
        color: '#DDD7FF',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 12,
    },
});
