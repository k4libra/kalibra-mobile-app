/**
 * Defines the local API address for each native platform.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Platform } from 'react-native';
/** Base URL without a trailing slash; Android emulators reach the host through 10.0.2.2. */
export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/v1'
    : 'http://localhost:8080/api/v1';
