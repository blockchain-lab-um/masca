module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/prefer-default-export': 0,
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.spec.ts',
          '**/*.e2e-spec.ts',
          '**/webpack.config.ts',
          '**/test/**/*.ts',
          '**/tests/**/*.ts',
        ],
      },
    ],
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/require-await': 'off',
  },
  overrides: [
    {
      // Disable in test files
      files: [
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/test/**/*.ts',
        '**/tests/**/*.ts',
      ],
      rules: {
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/!.eslintrc.js',
    '**/coverage/**',
    '**/build/**',
    '**/.docusaurus/**',
    '**/next.config.js',
  ],
};
