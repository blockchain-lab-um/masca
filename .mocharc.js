module.exports = {
  color: true,
  extension: 'ts',
  parallel: false,
  recursive: true,
  require: ['ts-node/register', 'tests/hook.ts', 'mocha-suppress-logs'],
  reporter: 'spec',
  spec: 'tests',
};
