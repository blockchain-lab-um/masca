module.exports = {
  '*.{js,ts}': ['eslint --fix'],
  '*.ts': () => 'tsc -p tsconfig.json --noEmit',
  '*.{md,json,yml,yaml}': ['prettier --write'],
};
