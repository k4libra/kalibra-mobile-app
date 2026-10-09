
/**
 * Course selector for academic progress.
 *
 * Feature: progress-history
 *
 * Displays the selected course and allows
 * switching between enrolled courses.
 *
 * @packageDocumentation
 */

import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { EnrolledCourse } from '../../types/course';

interface CourseSelectorProps {
    courses: EnrolledCourse[];
    selectedCourseId: string;
    onSelectCourse: (courseId: string) => void;
    disabled?: boolean;
}

export function CourseSelector({
                                   courses,
                                   selectedCourseId,
                                   onSelectCourse,
                                   disabled = false,
                               }: CourseSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCourse = courses.find(
        course => course.id === selectedCourseId,
    );

    const handleSelect = (courseId: string) => {
        onSelectCourse(courseId);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                CURSO SELECCIONADO
            </Text>

            <Pressable
                style={[
                    styles.selector,
                    disabled && styles.disabled,
                ]}
                onPress={() => setIsOpen(true)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar curso"
            >
                <View style={styles.selectorContent}>
                    <Text
                        style={styles.courseName}
                        numberOfLines={1}
                    >
                        {selectedCourse?.name ?? 'Seleccionar curso'}
                    </Text>

                    <Text style={styles.courseSubtitle}>
                        Consulta tu progreso académico
                    </Text>
                </View>

                <Text style={styles.chevron}>⌄</Text>
            </Pressable>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setIsOpen(false)}
                        accessibilityLabel="Cerrar selector"
                    />

                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Seleccionar curso
                            </Text>

                            <Pressable
                                onPress={() => setIsOpen(false)}
                                accessibilityRole="button"
                                accessibilityLabel="Cerrar"
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={styles.courseList}
                        >
                            {courses.map(course => {
                                const isSelected =
                                    course.id === selectedCourseId;

                                return (
                                    <Pressable
                                        key={course.id}
                                        onPress={() => handleSelect(course.id)}
                                        accessibilityRole="button"
                                        accessibilityState={{
                                            selected: isSelected,
                                        }}
                                        style={[
                                            styles.courseOption,
                                            isSelected && styles.selectedOption,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.optionName,
                                                isSelected && styles.selectedText,
                                            ]}
                                        >
                                            {course.name}
                                        </Text>

                                        {isSelected ? (
                                            <Text style={styles.checkIcon}>
                                                ✓
                                            </Text>
                                        ) : null}
                                    </Pressable>
                                );
                            })}

                            {courses.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    No tienes cursos disponibles.
                                </Text>
                            ) : null}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },

    label: {
        color: '#747B90',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 10,
    },

    selector: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7F2',
        borderRadius: 14,
        minHeight: 68,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    disabled: {
        opacity: 0.5,
    },

    selectorContent: {
        flex: 1,
        paddingRight: 12,
    },

    courseName: {
        color: '#141A33',
        fontSize: 14,
        fontWeight: '700',
    },

    courseSubtitle: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 5,
    },

    chevron: {
        color: '#6C5CE7',
        fontSize: 25,
        fontWeight: '600',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(20, 26, 51, 0.45)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        maxHeight: '65%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    modalTitle: {
        color: '#141A33',
        fontSize: 17,
        fontWeight: '700',
    },

    closeText: {
        color: '#747B90',
        fontSize: 20,
    },

    courseList: {
        flexGrow: 0,
    },

    courseOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 6,
    },

    selectedOption: {
        backgroundColor: '#F0EDFF',
    },

    optionName: {
        flex: 1,
        color: '#141A33',
        fontSize: 13,
        fontWeight: '600',
    },

    selectedText: {
        color: '#6C5CE7',
    },

    checkIcon: {
        color: '#6C5CE7',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 12,
    },

    emptyText: {
        color: '#747B90',
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: 20,
    },
});
