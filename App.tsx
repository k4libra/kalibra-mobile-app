/**
 * Root component: global providers and navigation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { AuthProvider } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';

// Navigation theme aligned with the design system surfaces.
const NAVIGATION_THEME: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.primary, background: colors.surfaceBackground, card: colors.surfaceBackground },
};

/**
 * Mounts the safe area provider, the navigation container and the root navigator.
 */
export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar barStyle="dark-content" />

                <NavigationContainer theme={NAVIGATION_THEME}>
                    <RootNavigator />
                </NavigationContainer>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
