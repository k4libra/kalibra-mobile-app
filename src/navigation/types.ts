/**
 * Route parameters of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Tabs of the bottom navigation and their parameters.
 */
export type TabParamList = {
  Courses: undefined;
  Progress: undefined;
  History: undefined;
  Profile: undefined;
};

/**
 * Screens of the root stack and their parameters.
 */
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  CourseSubtopics: { courseId: string };
  Invitations: undefined;
  EnrollmentConfirmed: { invitationId: string };
  Exercise: { courseId: string; subtopicId: string };
  ExerciseResult: { exerciseId: string; optionId: string };
};

/**
 * Props received by a screen of the root stack.
 *
 * @typeParam T - Name of the screen.
 */
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
