const esModules = ['@veramo'].join('|');

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
          baseUrl: './',
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
    mapmoize:
      '<rootDir>/../../node_modules/.pnpm/mapmoize@1.2.1/node_modules/mapmoize/dist/index.js',
    uint8arrays:
      '<rootDir>/../../node_modules/.pnpm/uint8arrays@4.0.3/node_modules/uint8arrays/src/index.ts',
    '@ipld/dag-cbor':
      '<rootDir>/../../node_modules/.pnpm/@didtools+cacao@2.0.0/node_modules/@ipld/dag-cbor/dist/index.min.js',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})/`],
  testTimeout: 120000,
  modulePathIgnorePatterns: ['<rootDir>/old_tests/'],
};
