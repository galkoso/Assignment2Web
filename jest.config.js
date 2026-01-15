/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

