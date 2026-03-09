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

  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/', '<rootDir>/integration/'],

  setupFiles: ['./jest.setup.js'],

  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.tsx'],
  coverageReporters: ['text'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};