module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  plugins: ['import'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
};
