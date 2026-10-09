
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type AuthAlertVariant = 'error' | 'success' | 'info';

interface AuthAlertProps {
    message: string;
    title?: string;
    variant?: AuthAlertVariant;
    onDismiss?: () => void;
}

const ALERT_COLORS = {
    error: {
        background: '#FFF1F0',
        border: '#F7C5C1',
        icon: '#C91E22',
        text: '#9F2427',
    },
    success: {
        background: '#E8FFF4',
        border: '#B5EBD2',
        icon: '#047857',
        text: '#075E43',
    },
    info: {
        background: '#EEF0FF',
        border: '#D9DEFF',
        icon: '#4F46E5',
        text: '#303A65',
    },
};

export function AuthAlert({
                              message,
                              title,
                              variant = 'error',
                              onDismiss,
                          }: AuthAlertProps) {
    const colors = ALERT_COLORS[variant];

    const symbol =
        variant === 'success'
            ? '✓'
            : variant === 'info'
                ? 'i'
                : '!';

    return (
        <View
            accessibilityRole="alert"
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                },
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: colors.icon },
                ]}
            >
                <Text style={styles.iconText}>
                    {symbol}
                </Text>
            </View>

            <View style={styles.content}>
                {title ? (
                    <Text
                        style={[
                            styles.title,
                            { color: colors.text },
                        ]}
                    >
                        {title}
                    </Text>
                ) : null}

                <Text
                    style={[
                        styles.message,
                        { color: colors.text },
                    ]}
                >
                    {message}
                </Text>
            </View>

            {onDismiss ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar alerta"
                    onPress={onDismiss}
                    hitSlop={10}
                    style={styles.dismissButton}
                >
                    <Text
                        style={[
                            styles.dismissText,
                            { color: colors.text },
                        ]}
                    >
                        ×
                    </Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 13,
        paddingVertical: 12,
        marginBottom: 16,
    },

    iconContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 1,
    },

    iconText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
    },

    content: {
        flex: 1,
    },

    title: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 3,
    },

    message: {
        fontSize: 12,
        lineHeight: 18,
    },

    dismissButton: {
        minWidth: 24,
        minHeight: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    dismissText: {
        fontSize: 22,
        fontWeight: '400',
        lineHeight: 24,
    },
});
