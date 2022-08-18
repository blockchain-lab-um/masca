module.exports = {
  color: true,
  extension: 'ts',
  parallel: false,
  recursive: true,
  require: ['ts-node/register', 'tests/hook.ts'],
  reporter: 'spec',
  spec: 'tests',
};
