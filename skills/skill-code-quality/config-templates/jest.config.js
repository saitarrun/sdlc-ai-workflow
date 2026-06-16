/**
 * Jest Configuration — Enforces Testing Pyramid & Coverage Standards
 * Covers: unit tests, integration tests, coverage thresholds, regression testing
 */

module.exports = {
  displayName: 'tests',
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Coverage Thresholds — 80% minimum (fail if lower)
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.test.ts',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Critical paths require 95%+ coverage
    'src/auth/**': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    'src/api/**': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Test Patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
  ],

  // F.I.R.S.T. Principles
  testTimeout: 10000, // Fast: tests should complete quickly
  maxWorkers: '50%', // Independent: run tests in parallel
  bail: 0, // Repeatable: run all tests even if one fails
  verbose: true, // Self-validating: clear pass/fail output

  // Module paths for easier imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/src/__tests__/$1',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],

  // Transform configuration
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/'],

  // Performance monitoring
  slowTestThreshold: 1, // Warn if test takes >1s (unit tests should be <100ms)
};
