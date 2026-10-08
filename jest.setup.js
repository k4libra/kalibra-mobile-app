/* eslint-env jest */
// Native modules that do not exist in the test environment use the official mocks of each library.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
require('react-native-screens').enableScreens(false);
