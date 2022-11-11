module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      files: ['tests/**/*.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: { 'jest/prefer-expect-assertions': 'off' },
      env: { jest: true },
    },
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  ignorePatterns: ['src/post-process/post-process.js'],
};
