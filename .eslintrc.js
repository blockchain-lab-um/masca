module.exports = {
  root: true,
  extends: ['prettier'],
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-prettier'],
  parser: '@typescript-eslint/parser',
  rules: { 'prettier/prettier': ['error', { singleQuote: true }] },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/!.eslintrc.js',
    '**/coverage/**',
    '**/build/**',
    '**/.docusaurus/**',
  ],
};
