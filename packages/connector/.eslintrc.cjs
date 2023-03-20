module.exports = {
  root: true,
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/unbound-method': 0,
  },
};
