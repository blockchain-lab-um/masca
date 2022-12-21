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
        ],
      },
    ],
    'prettier/prettier': ['error', { singleQuote: true }],
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/!.eslintrc.js',
    '**/coverage/**',
    '**/build/**',
    '**/.docusaurus/**',
  ],
};
