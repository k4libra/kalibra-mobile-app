
/**
 * Circular mastery indicator.
 *
 * Feature: progress-history
 *
 * Displays academic mastery as a circular
 * progress indicator, following the Figma design.
 *
 * @packageDocumentation
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface MasteryRingProps {
    mastery: number | null;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}

const PRIMARY_COLOR = '#6C5CE7';
const TRACK_COLOR = '#EAE6FF';

/**
 * Circular progress indicator built with
 * React Native views, without SVG dependencies.
 */
export function MasteryRing({
                                mastery,
                                size = 160,
                                strokeWidth = 12,
                                showLabel = true,
                            }: MasteryRingProps) {
    const hasMastery =
        mastery !== null &&
        Number.isFinite(mastery);

    const percentage = hasMastery
        ? Math.max(0, Math.min(100, mastery))
        : 0;

    const rotation = (percentage / 100) * 360;

    const half = size / 2;

    const leftRotation = Math.min(rotation, 180);
    const rightRotation = Math.max(rotation - 180, 0);

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                },
            ]}
            accessibilityRole="progressbar"
            accessibilityLabel="Dominio académico"
            accessibilityValue={{
                min: 0,
                max: 100,
                now: percentage,
            }}
        >
            {/* Background track */}
            <View
                style={[
                    styles.track,
                    {
                        width: size,
                        height: size,
                        borderRadius: half,
                        borderWidth: strokeWidth,
                    },
                ]}
            />

            {/* Left half */}
            <View
                style={[
                    styles.halfContainer,
                    {
                        width: half,
                        height: size,
                        left: 0,
                    },
                ]}
            >
                <View
                    style={[
                        styles.progressHalf,
                        {
                            width: size,
                            height: size,
                            borderRadius: half,
                            borderWidth: strokeWidth,
                            borderColor: PRIMARY_COLOR,
                            transform: [
                                {
                                    rotate: `${leftRotation}deg`,
                                },
                            ],
                        },
                    ]}
                />
            </View>

            {/* Right half */}
            <View
                style={[
                    styles.halfContainer,
                    {
                        width: half,
                        height: size,
                        right: 0,
                    },
                ]}
            >
                <View
                    style={[
                        styles.progressHalf,
                        {
                            width: size,
                            height: size,
                            borderRadius: half,
                            borderWidth: strokeWidth,
                            borderColor: PRIMARY_COLOR,
                            left: -half,
                            transform: [
                                {
                                    rotate: `${rightRotation}deg`,
                                },
                            ],
                        },
                    ]}
                />
            </View>

            {/* Center content */}
            <View
                style={[
                    styles.center,
                    {
                        width: size - strokeWidth * 2,
                        height: size - strokeWidth * 2,
                        borderRadius:
                            (size - strokeWidth * 2) / 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.percentage,
                        {
                            fontSize: size * 0.26,
                        },
                    ]}
                >
                    {hasMastery
                        ? `${Math.round(percentage)}%`
                        : '--'}
                </Text>

                {showLabel && (
                    <Text style={styles.label}>
                        DOMINIO
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    track: {
        position: 'absolute',
        borderColor: TRACK_COLOR,
    },

    halfContainer: {
        position: 'absolute',
        overflow: 'hidden',
        top: 0,
    },

    progressHalf: {
        position: 'absolute',
        top: 0,
        left: 0,
    },

    center: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    percentage: {
        color: '#141A33',
        fontWeight: '800',
        letterSpacing: -1,
    },

    label: {
        color: '#747B90',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginTop: 2,
    },
});
