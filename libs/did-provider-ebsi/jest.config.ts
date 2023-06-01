export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'tests'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
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
  transformIgnorePatterns: ['/node_modules/(?!@veramo)/'],
};
