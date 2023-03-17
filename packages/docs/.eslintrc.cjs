module.exports = {
  root: true,
  extends: ['../../.eslintrc.cjs'],
  plugins: ['import'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
};
