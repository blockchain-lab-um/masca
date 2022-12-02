module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    '../../../.eslintrc.js',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.ts', '**/*.e2e-spec.ts'] },
    ],
    'react/jsx-filename-extension': 'off',
    'max-len': ['error', { code: 120 }],
  },
  overrides: [
    {
      files: ['tests/**/*.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: { 'jest/no-export': 'off' },
    },
  ],
};
