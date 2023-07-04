const fs = require('fs');
const pathUtils = require('path');

console.log('Post-processing bundle');

const bundlePath = pathUtils.join('dist', 'snap.js');

let bundleString = fs.readFileSync(bundlePath, 'utf8');

// Alias `window` as `self`
bundleString = 'var self = window;\n'.concat(bundleString);

// Remove useless "stdlib" argument from bignumber.js asm module
bundleString = bundleString
  .replace(
    `module.exports = function decodeAsm (stdlib, foreign, buffer) {`,
    `module.exports = function decodeAsm (foreign, buffer) {`
  )
  .replace(/stdlib\./gu, '');

// Remove readonly assignment
bundleString = bundleString.replace(
  `Gp[iteratorSymbol] = function() {
    return this;
  };`,
  ''
);

// Fix TextEncoder and TextDecoder
bundleString = bundleString.replace(
  'const textEncoder = new TextEncoder();',
  ''
);
bundleString = bundleString.replace(
  'const textDecoder = new TextDecoder();',
  ''
);
bundleString = bundleString.replace('textEncoder.', 'new TextEncoder().');
bundleString = bundleString.replace('textDecoder.', 'new TextDecoder().');

// Fix import error
bundleString = bundleString.replaceAll('.import(', '.importPKey(');
bundleString = bundleString.replaceAll('import(args)', 'importPKey(args)');

// Fix root errors
bundleString = bundleString.replaceAll(
  "var coreJsData = root['__core-js_shared__'];",
  "if(root) {var coreJsData = root['__core-js_shared__'];}"
);

bundleString = bundleString.replaceAll(
  'var Symbol = root.Symbol',
  'if(root)var Symbol = root.Symbol'
);

bundleString = bundleString.replaceAll(
  'var Buffer = moduleExports ? root.Buffer : undefined,',
  'if(root)var Buffer = moduleExports ? root.Buffer : undefined,'
);

bundleString = bundleString.replaceAll(
  `process.env.NODE_ENV === 'production'`,
  `true`
);

bundleString = bundleString.replaceAll(
  `Gp[iteratorSymbol]`,
  `Gp.iteratorSymbol`
);

// Remove 'use asm' tokens; they cause pointless console warnings
bundleString = bundleString.replace(/^\s*'use asm';?\n?/gmu, '');

bundleString = bundleString.replace(
  "/** @type {import('cborg').TagDecoder[]} */",
  ''
);

fs.writeFileSync(bundlePath, bundleString);

console.log('Finished post-processing bundle');
