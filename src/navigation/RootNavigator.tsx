/**
 * Navigators of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar } from '@/components/layout';
import { ExerciseResultScreen } from '@/screens/ExerciseResultScreen';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Each feature branch replaces the placeholder of the screens it owns.
const CoursesTab = () => <PlaceholderScreen title="Mis cursos" branch="feature/courses-enrollment" />;
const ProgressTab = () => <PlaceholderScreen title="Mi progreso" branch="feature/progress-history" />;
const HistoryTab = () => <PlaceholderScreen title="Historial" branch="feature/progress-history" />;
const ProfileTab = () => <PlaceholderScreen title="Perfil" branch="feature/auth-profile" />;
const SignInScreen = () => <PlaceholderScreen title="Inicio de sesión" branch="feature/auth-profile" />;
const SignUpScreen = () => <PlaceholderScreen title="Registro" branch="feature/auth-profile" />;
const CourseSubtopicsScreen = () => <PlaceholderScreen title="Subtemas" branch="feature/courses-enrollment" />;
const InvitationsScreen = () => <PlaceholderScreen title="Invitaciones" branch="feature/courses-enrollment" />;
const EnrollmentConfirmedScreen = () => <PlaceholderScreen title="Matrícula" branch="feature/courses-enrollment" />;

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
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
}

/**
 * Renders the root stack: the tabs and the screens pushed over them.
 *
 * @remarks
 * The app opens on the tabs; the sign-in guard belongs to feature/auth-profile.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="CourseSubtopics" component={CourseSubtopicsScreen} />
      <Stack.Screen name="Invitations" component={InvitationsScreen} />
      <Stack.Screen name="EnrollmentConfirmed" component={EnrollmentConfirmedScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="ExerciseResult" component={ExerciseResultScreen} />
    </Stack.Navigator>
  );
}
