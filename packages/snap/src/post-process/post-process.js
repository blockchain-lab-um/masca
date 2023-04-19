const fs = require('fs');
const pathUtils = require('path');

const bundlePath = pathUtils.join('dist', 'snap.js');
console.log('Bundle path', bundlePath);

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

// FIXME: Remove this when 0,32.2 snaps is released to MetaMask Flask

// Replace `btoa`
bundleString = bundleString.replace(
  "return btoa(s.join(''));",
  "return Buffer.from(s.join('')).toString('base64');"
);

bundleString = bundleString.replace(
  "return btoa(arr.join(''));",
  "return Buffer.from(arr.join('')).toString('base64');"
);

let pattern =
  /const buf = BufferSourceConverter\.toUint8Array\(buffer\);\n\s*if \(typeof btoa !== "undefined"\) {\n\s*const binary = this\.ToString\(buf, "binary"\);\n\s*return btoa\(binary\);\n\s*} else {\n\s*return Buffer\.from\(buf\)\.toString\("base64"\);\n\s*}/g;

let replacement = 'return Buffer.from(buf).toString("base64");';

bundleString = bundleString.replace(pattern, replacement);

bundleString = bundleString.replace(
  'return btoa(textData);',
  'return Buffer.from(textData).toString("base64");'
);

// Replace `atob`
pattern =
  /if\s*\(typeof\s*atob\s*===\s*'undefined'\)\s*{\s*if\s*\(typeof\s*Buffer\.from\s*!==\s*'undefined'\)\s*{\s*util\.encodeBase64\s*=\s*function\s*\(arr\)\s*{\s*return\s*Buffer\.from\(arr\)\.toString\('base64'\);\s*};\s*util\.decodeBase64\s*=\s*function\s*\(s\)\s*{\s*validateBase64\(s\);\s*return\s*new\s*Uint8Array\(Array\.prototype\.slice\.call\(Buffer\.from\(s,\s*'base64'\),\s*0\)\);\s*};\s*}\s*else\s*{\s*util\.encodeBase64\s*=\s*function\s*\(arr\)\s*{\s*return\s*new\s*Buffer\(arr\)\.toString\('base64'\);\s*};\s*util\.decodeBase64\s*=\s*function\s*\(s\)\s*{\s*validateBase64\(s\);\s*return\s*new\s*Uint8Array\(Array\.prototype\.slice\.call\(new\s*Buffer\(s,\s*'base64'\),\s*0\)\);\s*};\s*}\s*}\s*else\s*{\s*util\.encodeBase64\s*=\s*function\s*\(arr\)\s*{\s*var\s*i,\s*s\s*=\s*\[],\s*len\s*=\s*arr\.length;\s*for\s*\(i\s*=\s*0;\s*i\s*<\s*len;\s*i\+\+\)\s*s\.push\(String\.fromCharCode\(arr\[i\]\)\);\s*return\s*Buffer\.from\(s\.join\(''\)\)\.toString\('base64'\);\s*};\s*util\.decodeBase64\s*=\s*function\s*\(s\)\s*{\s*validateBase64\(s\);\s*var\s*i,\s*d\s*=\s*atob\(s\),\s*b\s*=\s*new\s*Uint8Array\(d\.length\);\s*for\s*\(i\s*=\s*0;\s*i\s*<\s*d\.length;\s*i\+\+\)\s*b\[i\]\s*=\s*d\.charCodeAt\(i\);\s*return\s*b;\s*};\s*}/g;

replacement =
  "util.encodeBase64 = function (arr) { return Buffer.from(arr).toString('base64'); }; util.decodeBase64 = function (s) { validateBase64(s); return new Uint8Array(Array.prototype.slice.call(Buffer.from(s, 'base64'), 0)); };";

bundleString = bundleString.replace(pattern, replacement);

bundleString = bundleString.replace(
  'const binary = atob(encoded);',
  'const binary = Buffer.from(encoded, "base64").toString();'
);

bundleString = bundleString.replace(
  "const keyData = new Uint8Array(atob(pem.replace(replace, '')).split('').map(c => c.charCodeAt(0)));",
  "const keyData = new Uint8Array(Buffer.from(pem.replace(replace, ''), \"base64\").toString().split('').map(c => c.charCodeAt(0)));"
);

const atobFunction = `function atab(data) {
  if (arguments.length === 0) {
  throw new TypeError("1 argument required, but only 0 present.");
  }

  data = \`\$\{data\}\`;
  data = data.replace(/[ \\t\\n\\f\\r]/g, "");
  if (data.length % 4 === 0) {
  data = data.replace(/==?$/, "");
  }

  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
  return null;
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;

  for (let i = 0; i < data.length; i++) {
  buffer <<= 6;
  buffer |= atobLookup(data[i]);
  accumulatedBits += 6;
  if (accumulatedBits === 24) {
  output += String.fromCharCode((buffer & 0xff0000) >> 16);
  output += String.fromCharCode((buffer & 0xff00) >> 8);
  output += String.fromCharCode(buffer & 0xff);
  buffer = accumulatedBits = 0;
  }
  }
  if (accumulatedBits === 12) {
  buffer >>= 4;
  output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
  buffer >>= 2;
  output += String.fromCharCode((buffer & 0xff00) >> 8);
  output += String.fromCharCode(buffer & 0xff);
  }
  return output;
  }

  const keystr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function atobLookup(chr) {
  const index = keystr.indexOf(chr);
  return index < 0 ? undefined : index;
  }`;

bundleString = bundleString.replace(
  'textData = atob(textData);',
  `${atobFunction}\n textData = atab(textData);`
);

pattern =
  /if\s*\(typeof\s*atob\s*!==\s*"undefined"\)\s*{\s*return\s*this\.FromBinary\(atob\(formatted\)\);\s*}\s*else\s*{\s*return\s*new\s*Uint8Array\(Buffer\.from\(formatted,\s*"base64"\)\)\.buffer;\s*}/g;

replacement = 'return new Uint8Array(Buffer.from(formatted, "base64")).buffer;';

bundleString = bundleString.replace(pattern, replacement);

fs.writeFileSync(bundlePath, bundleString);
