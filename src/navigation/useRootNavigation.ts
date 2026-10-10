/**
 * Typed access to the root stack navigation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

/**
 * Returns the navigation object of the root stack, usable from tab screens too.
 *
 * @returns The typed navigation of {@link RootStackParamList}.
 *
 * @example
 * ```tsx
 * const navigation = useRootNavigation();
 * navigation.navigate('Invitations');
 * ```
 */
export function useRootNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
