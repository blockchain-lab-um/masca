module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  overrides: [
    {
      files: [
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/test/**',
        '**/tests/**',
        '**/__tests__/**',
        '**/*.spec.ts',
      ],
      rules: {
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
  plugins: ['@typescript-eslint', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  rules: {
    // other rules
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    // FIXME: Turn this on and fix in separate PR
    'no-unused-vars': [
      'off',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-param-reassign': [2, { props: false }],
    'no-await-in-loop': 'off',
    'no-nested-ternary': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/require-await': 'off',
    // for unused-imports library
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'import/prefer-default-export': 0,
    'class-methods-use-this': 'off',
    // for tests
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.spec.ts',
          '**/*.e2e-spec.ts',
          '**/webpack.config.ts',
          '**/test/**/*.ts',
          '**/tests/**/*.ts',
          '**/tsup.config.ts',
          '**/jest.d.ts',
          '**/test/**',
          '**/tests/**',
          '**/vite.config.mts',
          '**/scripts/**/*.ts',
        ],
      },
    ],
    'import/extensions': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/!.eslintrc.cjs',
    '**/coverage/**',
    '**/build/**',
    '**/.docusaurus/**',
    '**/next.config.js',
    '**/out',
    '**/.next',
    'tsup.config.ts',
    'templates',
    'external',
    '.nx',
  ],
};
