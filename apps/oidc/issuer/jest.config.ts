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
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            decorators: true,
            dynamicImport: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          keepClassNames: true,
          baseUrl: './',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[tj]sx?$': '$1',
    '^multiformats/(.*)$': '<rootDir>/node_modules/multiformats/src/$1.js',
    '^multiformats$': '<rootDir>/node_modules/multiformats/src/index.js',
    uint8arrays:
      '<rootDir>/../../../node_modules/.pnpm/uint8arrays@4.0.6/node_modules/uint8arrays/src/index.ts',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@veramo)/'],
  testTimeout: 120000,
};
