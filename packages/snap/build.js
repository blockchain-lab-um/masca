const esbuild = require('esbuild');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
let stdLibBrowser = require('node-stdlib-browser');

stdLibBrowser = {
  ...stdLibBrowser
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
    "@0xpolygonid/js-sdk":'../../node_modules/.pnpm/github.com+0xPolygonID+js-sdk@b50447564b642c3835c811bd32e1350eb189578c_xr65kx4diede7av7icn3kqhvj4/node_modules/@0xpolygonid/js-sdk/dist/esm/index.js'
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
