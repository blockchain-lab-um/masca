module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {},
};
