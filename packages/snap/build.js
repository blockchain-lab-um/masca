const esbuild = require('esbuild');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
let stdLibBrowser = require('node-stdlib-browser');
const path = require('path');

stdLibBrowser = {
  ...stdLibBrowser,
  '@0xpolygonid/js-sdk': path.join(
    __dirname,
    'node_modules/@0xpolygonid/js-sdk/dist/esm/index.js'
  ),
};
console.log('Building snap with esbuild...');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/snap.js',
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2020',
  treeShaking: true,
  tsconfig: 'tsconfig.build.json',
  plugins: [plugin(stdLibBrowser)],
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer',
  },
  inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
});

console.log('Finished building snap...');
