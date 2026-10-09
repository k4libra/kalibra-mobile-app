
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface AuthHeaderProps {
    title: string;
    subtitle?: string;
}

/**
 * Shared header for authentication screens.
 *
 * Displays the Kalibra brand and the title
 * of the current authentication flow.
 */
export function AuthHeader({
                               title,
                               subtitle,
                           }: AuthHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Brand */}
            <View style={styles.brandContainer}>
                <View style={styles.logo}>
                    <Text style={styles.logoLetter}>K</Text>
                </View>

                <Text style={styles.brandName}>
                    Kalibra
                </Text>
            </View>

            {/* Heading */}
            <Text style={styles.title}>
                {title}
            </Text>

            {subtitle ? (
                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 28,
    },

    brandContainer: {
        alignItems: 'center',
        marginBottom: 28,
    },

    logo: {
        width: 54,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#6C5CE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    logoLetter: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
    },

    brandName: {
        color: '#141A33',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    title: {
        color: '#141A33',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        color: '#60657A',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        maxWidth: 300,
    },
});
