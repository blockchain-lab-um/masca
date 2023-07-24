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
    "@0xpolygonid/js-sdk":'../../node_modules/.pnpm/github.com+0xPolygonID+js-sdk@683a2086c2abbc0e0975f6407c4d94e59c32ac3b_zzns4emxmbmz5u5pmyjyhfgn4e/node_modules/@0xpolygonid/js-sdk/dist/esm/index.js'
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
