
/**
 * Navigators of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoadingState } from '@/components/ui';
import { colors } from '@/theme/tokens';
import { BottomTabBar } from '@/components/layout';
import { CourseSubtopicsScreen } from '@/screens/CourseSubtopicsScreen';
import { EnrollmentConfirmedScreen } from '@/screens/EnrollmentConfirmedScreen';
import { ExerciseResultScreen } from '@/screens/ExerciseResultScreen';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { InvitationsScreen } from '@/screens/InvitationsScreen';
import { MyCoursesScreen } from '@/screens/MyCoursesScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';

import { SignInScreen } from '@/screens/SignInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { useAuth } from '@/hooks/useAuth';

import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();


// Renders the custom bottom bar of the design system.
const renderTabBar = (props: React.ComponentProps<typeof BottomTabBar>) => <BottomTabBar {...props} />;

/**
 * Renders the four main tabs of the app.
 */
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen name="Courses" component={MyCoursesScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
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
    const { isAuthenticated, isLoading, session } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <LoadingState />
            </View>
        );
    }

    return (
        <Stack.Navigator key={session?.accessToken ?? 'signed-out'} screenOptions={{ headerShown: false }}>
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
        backgroundColor: colors.surfaceBackground,
    },
});
