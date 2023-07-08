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

fs.writeFileSync(bundlePath, bundleString);

console.log('Finished post-processing bundle');
