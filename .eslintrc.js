module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:testing-library/react',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'testing-library', 'prettier'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'testing-library/await-async-query': 'error',
		'testing-library/no-await-sync-query': 'error',
		'testing-library/no-debugging-utils': 'warn',
		'testing-library/no-dom-import': 'off',
    'jsx-quotes': ['error', 'prefer-single']
  },
};
