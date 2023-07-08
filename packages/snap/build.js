const esbuild = require('esbuild');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');

console.log('Building snap with esbuild...');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/snap.js',
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2020',
  treeShaking: true,
  plugins: [plugin(stdLibBrowser)],
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer',
  },
  inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
});

console.log('Finished building snap...');
