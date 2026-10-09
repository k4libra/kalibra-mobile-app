
import React from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

interface PreferenceRowProps {
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    icon?: string;
    showDivider?: boolean;
}

/**
 * Reusable preference row for the student profile.
 *
 * Supports controlled switches for settings such as
 * dark mode and daily reminders.
 */
export function PreferenceRow({
                                  title,
                                  description,
                                  value,
                                  onValueChange,
                                  disabled = false,
                                  icon,
                                  showDivider = true,
                              }: PreferenceRowProps) {
    return (
        <View
            style={[
                styles.container,
                showDivider && styles.divider,
            ]}
        >
            {icon ? (
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>
                        {icon}
                    </Text>
                </View>
            ) : null}

            <View style={styles.content}>
                <Text style={styles.title}>
                    {title}
                </Text>

                {description ? (
                    <Text style={styles.description}>
                        {description}
                    </Text>
                ) : null}
            </View>

            <Switch
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                trackColor={{
                    false: '#DDE1F0',
                    true: '#B8AEFF',
                }}
                thumbColor={
                    value ? '#6C5CE7' : '#FFFFFF'
                }
                ios_backgroundColor="#DDE1F0"
                accessibilityRole="switch"
                accessibilityLabel={title}
                accessibilityState={{
                    checked: value,
                    disabled,
                }}
                style={styles.switch}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 2,
        minHeight: 70,
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#ECEEFA',
    },

    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    iconText: {
        color: '#6C5CE7',
        fontSize: 19,
        fontWeight: '600',
    },

    content: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        color: '#141A33',
        fontSize: 13,
        fontWeight: '600',
    },

    description: {
        color: '#747B90',
        fontSize: 11,
        lineHeight: 17,
        marginTop: 4,
    },

    switch: {
        marginLeft: 8,
    },
});
