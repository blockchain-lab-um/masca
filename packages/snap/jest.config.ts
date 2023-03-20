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
  globals: { window: { location: { hostname: 'ssi-snap' } } },
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
    'multiformats/bases/base58':
      '<rootDir>/node_modules/multiformats/src/bases/base58.js',
    'multiformats/bases/base36':
      '<rootDir>/node_modules/multiformats/src/bases/base36.js',
    'multiformats/hashes/sha2':
      '<rootDir>/node_modules/multiformats/src/hashes/sha2.js',
    'multiformats/hashes/digest':
      '<rootDir>/node_modules/multiformats/src/hashes/digest.js',
    'multiformats/basics': '<rootDir>/node_modules/multiformats/src/basics.js',
    'multiformats/cid': '<rootDir>/node_modules/multiformats/src/cid.js',
    'multiformats/block': '<rootDir>/node_modules/multiformats/src/block.js',
    mapmoize:
      '<rootDir>/../../node_modules/.pnpm/mapmoize@1.2.1/node_modules/mapmoize/dist/index.js',
    uint8arrays:
      '<rootDir>/../../node_modules/.pnpm/uint8arrays@4.0.3/node_modules/uint8arrays/src/index.ts',
    '@ipld/dag-cbor':
      '<rootDir>/../../node_modules/.pnpm/@didtools+cacao@2.0.0/node_modules/@ipld/dag-cbor/dist/index.min.js',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@veramo)/'],
  testTimeout: 120000,
};
