module.exports = {
  '*.{js,ts}': ['eslint --fix'],
  '*.{md,json,yml,yaml}': ['prettier --write'],
  '*.{ts}': () => 'tsc -p tsconfig.json --noEmit --incremental false',
};
