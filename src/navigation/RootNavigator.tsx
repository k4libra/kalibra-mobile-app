
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
import { CourseSubtopicsScreen } from '@/screens/CourseSubtopicsScreen';
import { EnrollmentConfirmedScreen } from '@/screens/EnrollmentConfirmedScreen';
import { ExerciseResultScreen } from '@/screens/ExerciseResultScreen';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { InvitationsScreen } from '@/screens/InvitationsScreen';
import { MyCoursesScreen } from '@/screens/MyCoursesScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';

import { SignInScreen } from '@/screens/SignInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { useAuth } from '@/hooks/useAuth';

import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Each feature branch replaces the placeholder of the screens it owns.
const ProgressTab = () => <PlaceholderScreen title="Mi progreso" branch="feature/progress-history" />;
const HistoryTab = () => <PlaceholderScreen title="Historial" branch="feature/progress-history" />;

// Renders the custom bottom bar of the design system.
const renderTabBar = (props: React.ComponentProps<typeof BottomTabBar>) => <BottomTabBar {...props} />;

/**
 * Renders the four main tabs of the app.
 */
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen name="Courses" component={MyCoursesScreen} />
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
