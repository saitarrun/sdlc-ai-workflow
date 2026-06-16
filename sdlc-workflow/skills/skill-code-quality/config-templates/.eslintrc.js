/**
 * ESLint Configuration — Enforces code quality standards
 * Covers: linting, formatting, naming, complexity, security
 */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    node: true,
    browser: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:security/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'security', 'sonarjs', 'jest'],
  rules: {
    // Naming Conventions
    'no-var': 'error',
    'prefer-const': 'error',
    'id-length': ['warn', { min: 2, exceptions: ['i', 'j', 'x', 'y', '_'] }],
    'id-match': [
      'error',
      '^[a-zA-Z_$][a-zA-Z0-9_$]*$|^[A-Z0-9_]+$',
      { properties: true, classFields: true },
    ],

    // Complexity Control
    complexity: ['warn', { max: 10 }],
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-nested-callbacks': ['warn', { max: 3 }],

    // DRY Principle
    'no-duplicate-imports': 'error',
    'no-dupe-keys': 'error',

    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'security/detect-eval-with-expression': 'error',
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',

    // Code Quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Handled by TypeScript
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // Error Handling
    'no-throw-literal': 'error',
    'no-unsafe-finally': 'error',

    // Best Practices
    'eqeqeq': ['error', 'always'],
    'no-implicit-coercion': 'error',
    'prefer-template': 'warn',
    'no-nested-ternary': 'warn',

    // Sonarjs rules for code smells
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/no-inverted-boolean-check': 'warn',
  },

  overrides: [
    {
      files: ['*.test.ts', '*.test.js', '**/__tests__/**'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'sonarjs/no-duplicate-string': 'off',
      },
    },
  ],
};
