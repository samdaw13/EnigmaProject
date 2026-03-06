import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/*.js', '**/*.mjs', 'node_modules/', 'android/', 'ios/', 'coverage/', 'e2e/'],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-await-sync-events': 'off',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'off',
    },
  },
  react.configs.flat.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react-hooks/set-state-in-effect': 'warn',
      'react/no-array-index-key': 'error',
      'react/self-closing-comp': 'error',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': ['warn', { ignoreExternal: true }],
    },
  },
  {
    rules: {
      'jsx-quotes': ['error', 'prefer-single'],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'args': 'all',
          'argsIgnorePattern': '^_',
          'caughtErrors': 'all',
          'caughtErrorsIgnorePattern': '^_',
          'destructuredArrayIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true,
        },
      ],
    },
  },
  prettier,
);
