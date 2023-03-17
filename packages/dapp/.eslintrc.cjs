module.exports = {
  root: true,
  extends: ['next/core-web-vitals', '../../.eslintrc.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
};
