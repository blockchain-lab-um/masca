/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'tests'],
  coverageProvider: 'v8',
  globals: {
    window: {
      location: {
        hostname: 'ssi-snap',
      },
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Waiting for this issue to be implemented:
    // https://github.com/facebook/jest/issues/9771
    'multiformats/bases/base58':
      '<rootDir>/node_modules/multiformats/src/bases/base58.js',
    'multiformats/basics': '<rootDir>/node_modules/multiformats/src/basics.js',
    mapmoize:
      '<rootDir>/../../node_modules/.pnpm/mapmoize@1.2.1/node_modules/mapmoize/dist/index.js',
    uint8arrays:
      '<rootDir>/../..//node_modules/.pnpm/uint8arrays@4.0.3/node_modules/uint8arrays/src/index.ts',
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!multiformats)/'],
  testTimeout: 120000,
};
