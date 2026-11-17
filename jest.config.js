module.exports = {
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1', '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js' },
};
