/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/__helpers__'],
};

module.exports = config;
