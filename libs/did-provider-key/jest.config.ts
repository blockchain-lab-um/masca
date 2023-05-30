export default {
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'tests'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'ts', 'mjs', 'cjs'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  setupFilesAfterEnv: ['jest-extended/all'],
  globals: {},
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            dynamicImport: true,
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Waiting for this issue to be implemented:
    // https://github.com/facebook/jest/issues/9771
    '^multiformats/(.*)$': '<rootDir>/node_modules/multiformats/src/$1.js',
    '^multiformats$': '<rootDir>/node_modules/multiformats/src/index.js',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@veramo)/'],
  testTimeout: 120000,
};
