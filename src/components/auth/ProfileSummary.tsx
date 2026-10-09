
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    AuthUser,
    ProfileStats,
} from '../../types/auth';

interface ProfileSummaryProps {
    user: AuthUser;
    stats: ProfileStats;
}

function getInitials(fullName: string): string {
    const names = fullName.trim().split(/\s+/);

    if (names.length === 0 || !names[0]) {
        return '?';
    }

    return names
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join('');
}

function formatMastery(mastery: number | null): string {
    return mastery === null
        ? '—'
        : `${Math.round(mastery)}%`;
}

export function ProfileSummary({
                                   user,
                                   stats,
                               }: ProfileSummaryProps) {
    return (
        <View style={styles.container}>
            {/* Información del estudiante */}
            <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {getInitials(user.fullName)}
                    </Text>
                </View>

                <Text style={styles.name}>
                    {user.fullName}
                </Text>

                <Text style={styles.email}>
                    {user.email}
                </Text>

                {(user.faculty || user.semester) ? (
                    <View style={styles.academicInfo}>
                        {user.faculty ? (
                            <Text style={styles.academicText}>
                                {user.faculty}
                            </Text>
                        ) : null}

                        {user.faculty && user.semester ? (
                            <Text style={styles.separator}>
                                •
                            </Text>
                        ) : null}

                        {user.semester ? (
                            <Text style={styles.academicText}>
                                {user.semester}
                            </Text>
                        ) : null}
                    </View>
                ) : null}
            </View>

            {/* Estadísticas */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {stats.solvedExerciseCount}
                    </Text>

                    <Text style={styles.statLabel}>
                        Ejercicios{'\n'}resueltos
                    </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {formatMastery(stats.averageMastery)}
                    </Text>

                    <Text style={styles.statLabel}>
                        Dominio{'\n'}promedio
                    </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {stats.activeCourseCount}
                    </Text>

                    <Text style={styles.statLabel}>
                        Cursos{'\n'}activos
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingTop: 26,
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: '#ECEEFA',
    },

    studentInfo: {
        alignItems: 'center',
    },

    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#E4E8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    avatarText: {
        color: '#6C5CE7',
        fontSize: 25,
        fontWeight: '800',
    },

    name: {
        color: '#141A33',
        fontSize: 19,
        fontWeight: '700',
        textAlign: 'center',
    },

    email: {
        color: '#60657A',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },

    academicInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 9,
        gap: 6,
    },

    academicText: {
        color: '#747B90',
        fontSize: 11,
    },

    separator: {
        color: '#A2A7BA',
        fontSize: 12,
    },

    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        paddingTop: 19,
        borderTopWidth: 1,
        borderTopColor: '#ECEEFA',
    },

    statItem: {
        flex: 1,
        alignItems: 'center',
    },

    statValue: {
        color: '#141A33',
        fontSize: 21,
        fontWeight: '800',
        marginBottom: 5,
    },

    statLabel: {
        color: '#747B90',
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },

    statDivider: {
        width: 1,
        height: 35,
        backgroundColor: '#ECEEFA',
    },
});
