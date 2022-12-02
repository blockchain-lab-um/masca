module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript',
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
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.ts', '**/*.e2e-spec.ts'] },
    ],
    'react/jsx-filename-extension': 'off',
    'max-len': ['error', { code: 250 }],
  },
};
