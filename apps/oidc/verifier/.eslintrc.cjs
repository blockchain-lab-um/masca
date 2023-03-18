module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    '../../../.eslintrc.cjs',
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
};
