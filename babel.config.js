/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  // Cache configuration is a required option
  api.cache(false);

  const presets = [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ];

  return { presets };
};
