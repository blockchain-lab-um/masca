const esbuild = require('esbuild');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
let stdLibBrowser = require('node-stdlib-browser');

stdLibBrowser = {
  ...stdLibBrowser,
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
  alias: {
    '@0xpolygonid/js-sdk':
      '../../node_modules/.pnpm/@0xpolygonid+js-sdk@1.7.5_patch_hash=uavclzybnhxuf7tfmy5fgbfawq_@iden3+js-crypto@1.0.3_@iden3_z7tfl2g3kztj45tlqef2kcaf2m/node_modules/@0xpolygonid/js-sdk/dist/node/esm/index.js',
  },
  plugins: [plugin(stdLibBrowser)],
  inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer',
  },
});

console.log('Finished building snap...');
