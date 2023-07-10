module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
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
      plugins: ['jest', 'jest-extended'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        'jest/prefer-expect-assertions': 'off',
        'jest/no-conditional-expect': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },

      env: { jest: true },
    },
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  rules: {
    // other rules
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'no-unused-vars': [
      'error',
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
        ],
      },
    ],
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
    'templates',
  ],
};
