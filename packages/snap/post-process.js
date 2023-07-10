const fs = require('fs');
const pathUtils = require('path');

console.log('Post-processing bundle');

const bundlePath = pathUtils.join('dist', 'snap.js');

let bundleString = fs.readFileSync(bundlePath, 'utf8');

// Alias `window` as `self`
bundleString = 'var self = window;\n'.concat(bundleString);

bundleString = bundleString.replace(
  "/** @type {import('cborg').TagDecoder[]} */",
  ''
);

// // [Polygon ID] Fix Worker
// bundleString = 'var Worker = {};\n'.concat(bundleString);

// // [Polygon ID] Fix promise
// bundleString = bundleString.replaceAll(
//   `new Function("return this;")().Promise`,
//   'Promise'
// );

// // [Polygon ID] Remove fs
// bundleString = bundleString.replaceAll('fs2.readFileSync;', 'null;');
// bundleString = bundleString.replaceAll('fs3.readFileSync;', 'null;');


fs.writeFileSync(bundlePath, bundleString);

console.log('Finished post-processing bundle');
