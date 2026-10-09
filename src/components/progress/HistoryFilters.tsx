
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { HistoryFilter } from '../../types/progress';

interface HistoryFiltersProps {
    filter: HistoryFilter;
    onChange: (filter: HistoryFilter) => void;
    counts?: {
        all: number;
        correct: number;
        review: number;
    };
    disabled?: boolean;
}

const FILTER_OPTIONS: {
    value: HistoryFilter;
    label: string;
}[] = [
    { value: 'all', label: 'Todos' },
    { value: 'correct', label: 'Correctos' },
    { value: 'review', label: 'Para repasar' },
];

export function HistoryFilters({
                                   filter,
                                   onChange,
                                   counts,
                                   disabled = false,
                               }: HistoryFiltersProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Historial de ejercicios
            </Text>

            <View style={styles.filtersRow}>
                {FILTER_OPTIONS.map(option => {
                    const isSelected = filter === option.value;
                    const count = counts?.[option.value];

                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            disabled={disabled}
                            accessibilityRole="button"
                            accessibilityState={{
                                selected: isSelected,
                                disabled,
                            }}
                            style={({ pressed }) => [
                                styles.filterButton,
                                isSelected && styles.selectedButton,
                                pressed && !disabled && styles.pressedButton,
                                disabled && styles.disabledButton,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    isSelected && styles.selectedText,
                                ]}
                            >
                                {option.label}
                            </Text>

                            {count !== undefined ? (
                                <View
                                    style={[
                                        styles.countBadge,
                                        isSelected && styles.selectedCountBadge,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.countText,
                                            isSelected && styles.selectedCountText,
                                        ]}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            ) : null}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 18,
    },

    title: {
        color: '#141A33',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
    },

    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 12,
        paddingHorizontal: 11,
        paddingVertical: 11,
        marginRight: 7,
    },

    selectedButton: {
        backgroundColor: '#6C5CE7',
        borderColor: '#6C5CE7',
    },

    pressedButton: {
        opacity: 0.8,
    },

    disabledButton: {
        opacity: 0.5,
    },

    filterText: {
        color: '#747B90',
        fontSize: 11,
        fontWeight: '700',
    },

    selectedText: {
        color: '#FFFFFF',
    },

    countBadge: {
        backgroundColor: '#F0EDFF',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
    },

    selectedCountBadge: {
        backgroundColor: 'rgba(255,255,255,0.22)',
    },

    countText: {
        color: '#6C5CE7',
        fontSize: 10,
        fontWeight: '800',
    },

    selectedCountText: {
        color: '#FFFFFF',
    },
});
