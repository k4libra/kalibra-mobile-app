module.exports = {
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
