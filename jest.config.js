module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**',
    '!src/views/**',
  ],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
  testPathIgnorePatterns: [
    '/__tests__/.*\\.integration\\.test\\.js$',
  ],
  verbose: true,
  testTimeout: 10000,
};
