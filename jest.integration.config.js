module.exports = {
  preset: 'react-native',

  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-native-async-storage' +
      '|@react-navigation' +
      '|@reduxjs' +
      '|react-redux' +
      '|immer' +
      '|react-native-paper' +
      '|react-native-vector-icons' +
      '|react-native-worklets' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|react-native-screens' +
      '|react-native-safe-area-context' +
      ')/)',
  ],

  moduleNameMapper: {
    '@react-native-clipboard/clipboard':
      '<rootDir>/__mocks__/@react-native-clipboard/clipboard.js',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testMatch: ['<rootDir>/integration/**/*.test.tsx'],

  setupFiles: ['./jest.setup.js'],

  testTimeout: 30000,
};
