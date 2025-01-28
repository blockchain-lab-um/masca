const fs = require('node:fs');
const pathUtils = require('node:path');

const { postProcessBundle } = require('@metamask/snaps-utils/node');

console.log('Post-processing bundle');

const bundlePath = pathUtils.join('dist', 'snap.js');

let bundleString = fs.readFileSync(bundlePath, 'utf8');

console.log('[Start]: MetaMask Snaps transform');

bundleString = postProcessBundle(bundleString, {
  stripComments: true,
}).code;

console.log('[End]: MetaMask Snaps transform');

console.log('[Start]: Custom transform');

// Alias `window` as `self`
bundleString = 'var self = window;\n'.concat(bundleString);

bundleString = bundleString.replace(
  "/** @type {import('cborg').TagDecoder[]} */",
  ''
);

// [Polygon ID] Fix Worker
bundleString = 'var Worker = {};\n'.concat(bundleString);

// [Polygon ID] fix single thread
bundleString = bundleString.replaceAll('if (singleThread)', 'if (true)');

// [Polygon ID] fix single thread
bundleString = bundleString.replaceAll(
  'singleThread: singleThread ? true : false',
  'singleThread: true'
);

// [sd-jwt-veramo] - @sphereon/ssi-sdk-ext.did-utils
bundleString = bundleString.replaceAll(
  'global.navigator.userAgent.indexOf("Edge/") > -1',
  'false'
);

// [sd-jwt veramo plugin] - fix cannot add property createHash, object is not extensible
bundleString = bundleString.replaceAll(
  'window.crypto.createHash = require_hash7()(window.crypto);',
  ''
);

// [sd-jwt veramo plugin] - fix cannot add property createHash, object is not extensible
bundleString = bundleString.replaceAll('var rf2 = require_browser21();', '');

// [sd-jwt veramo plugin] - fix cannot add property createHash, object is not extensible
bundleString = bundleString.replaceAll(
  'window.crypto.randomFill = rf2.randomFill;',
  ''
);

// [sd-jwt veramo plugin] - fix cannot add property createHash, object is not extensible
bundleString = bundleString.replaceAll(
  'window.crypto.randomFillSync = rf2.randomFillSync;',
  ''
);

// [sd-jwt veramo plugin] - fix cannot add property createHash, object is not extensible (lib/extended-verification)
bundleString = bundleString.replaceAll(
  'window.crypto.createHash = require_hash6()(window.crypto);',
  ''
);

// [sd-jwt veramo plugin] - fix cannot add property createHash, object is not extensible (lib/extended-verification)
bundleString = bundleString.replaceAll('var rf2 = require_browser20();', '');

console.log('[End]: Custom transform');

fs.writeFileSync(bundlePath, bundleString);

console.log('Finished post-processing bundle');
