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

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  setupFiles: ['./jest.setup.js'],

  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.tsx'],
  coverageReporters: ['text'],
};