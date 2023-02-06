export default {
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'tests'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'ts', 'mjs', 'cjs'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    // Order is important here, ts-jest must be before babel-jest
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.[tj]s$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@veramo/*)/'],
  testTimeout: 120000,
};
