module.exports = {
  root: true,
  extends: ['../../../.eslintrc.cjs'],
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
