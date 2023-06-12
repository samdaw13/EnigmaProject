module.exports = {
  preset: '@testing-library/react-native',
  transform: {
    '^.+\\.jsx$': 'ts-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@react-native|react-native)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.tsx'],
  coverageReporters: ['text']
}