
/**
 * Navigators of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomTabBar } from '@/components/layout';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';

import { SignInScreen } from '@/screens/SignInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { useAuth } from '@/hooks/useAuth';

import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Each feature branch replaces the placeholder of the screens it owns.
const CoursesTab = () => <PlaceholderScreen title="Mis cursos" branch="feature/courses-enrollment" />;
const ProgressTab = () => <PlaceholderScreen title="Mi progreso" branch="feature/progress-history" />;
const HistoryTab = () => <PlaceholderScreen title="Historial" branch="feature/progress-history" />;
const CourseSubtopicsScreen = () => <PlaceholderScreen title="Subtemas" branch="feature/courses-enrollment" />;
const InvitationsScreen = () => <PlaceholderScreen title="Invitaciones" branch="feature/courses-enrollment" />;
const EnrollmentConfirmedScreen = () => <PlaceholderScreen title="Matrícula" branch="feature/courses-enrollment" />;
const ExerciseScreen = () => <PlaceholderScreen title="Práctica de ejercicio" branch="feature/adaptive-practice" />;
const ExerciseResultScreen = () => <PlaceholderScreen title="Resultado" branch="feature/adaptive-practice" />;

// Renders the custom bottom bar of the design system.
const renderTabBar = (props: React.ComponentProps<typeof BottomTabBar>) => <BottomTabBar {...props} />;

/**
 * Renders the four main tabs of the app.
 */
function MainTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
            <Tab.Screen name="Courses" component={CoursesTab} />
            <Tab.Screen name="Progress" component={ProgressTab} />
            <Tab.Screen name="History" component={HistoryTab} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

/**
 * Renders the root stack: the tabs and the screens pushed over them.
 *
 * @remarks
 * The app displays authentication screens when there is no active session.
 * Authenticated students can access the main tabs and feature screens.
 */
export function RootNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C5CE7" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Tabs" component={MainTabs} />
                    <Stack.Screen name="CourseSubtopics" component={CourseSubtopicsScreen} />
                    <Stack.Screen name="Invitations" component={InvitationsScreen} />
                    <Stack.Screen name="EnrollmentConfirmed" component={EnrollmentConfirmedScreen} />
                    <Stack.Screen name="Exercise" component={ExerciseScreen} />
                    <Stack.Screen name="ExerciseResult" component={ExerciseResultScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF8FF',
    },
});
