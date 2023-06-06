module.exports = {
  root: true,
  extends: ['../../../.eslintrc.cjs'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
};
