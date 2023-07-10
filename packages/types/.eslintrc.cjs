module.exports = {
  root: true,
  extends: ['../../.eslintrc.cjs'],
  ignorePatterns: ['**/src/typia-generated/*.ts'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
};
