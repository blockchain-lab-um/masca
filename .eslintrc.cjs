module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
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
      plugins: ['jest'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        'jest/prefer-expect-assertions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
      env: { jest: true },
    },
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'jest-extended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    // other rules
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    // for unused-imports library
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
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
          '**/tsup.config.ts',
          '**/jest.d.ts',
          '**/test/**',
          '**/tests/**',
        ],
      },
    ],
    // for prettier
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/extensions': 'off',
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
  ],
};
