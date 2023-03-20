module.exports = {
  root: true,
<<<<<<<< HEAD:packages/snap/.eslintrc.cjs
  extends: ['../../.eslintrc.cjs'],
========
  extends: ['next/core-web-vitals', '../../.eslintrc.cjs'],
>>>>>>>> 945a5e6 (feat: update packages to esm (#135)):packages/dapp/.eslintrc.cjs
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  ignorePatterns: ['src/post-process/post-process.js'],
};
