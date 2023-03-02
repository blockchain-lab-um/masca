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
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-underscore-dangle': 'off',
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
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.spec.ts',
          '**/*.e2e-spec.ts',
          '**/webpack.config.ts',
        ],
      },
    ],
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/extensions': 'off',
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/!.eslintrc.js',
    '**/!.eslintrc.cjs',
    '**/coverage/**',
    '**/build/**',
    '**/.docusaurus/**',
    '**/next.config.js',
    '**/out',
    '**/.next',
  ],
};
