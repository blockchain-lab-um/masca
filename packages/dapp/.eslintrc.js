module.exports = {
  root: true,
  extends: ['next/core-web-vitals', '../../.eslintrc.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  ignorePatterns: ['**/database.types.ts'],
  rules: {
    '@typescript-eslint/no-misused-promises': 0,
    'global-require': 0,
  },
};
