import { resolve } from 'path';
import SnapsWebpackPlugin from '@metamask/snaps-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { ProvidePlugin, type Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import WebpackBarPlugin from 'webpackbar';

// Configuration that is shared between the two bundles
const common: Configuration = {
  // For simplicity, we don't do any optimisations here. Ideally, this would be
  // dependent on the `NODE_ENV` or script you're running.
  mode: 'none',
  devtool: 'source-map',
  stats: 'errors-only',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './dist',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      stream: false,
      http: false,
      https: false,
      zlib: false,
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify/'),
    },
  },
  module: {
    rules: [
      {
        test: /@chainsafe\/as-sha256/u,
        use: 'null-loader',
      },
      {
        test: /\.(m?js|ts)x?$/u,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      { test: /.json$/, type: 'json' },
    ],
  },
  plugins: [
    new WebpackBarPlugin(),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new ESLintPlugin({
      extensions: ['ts'],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        configFile: 'tsconfig.build.json',
      },
    }),
  ],
  watchOptions: {
    ignored: ['**/snap.manifest.json'],
  },
};

// Configuration for the Snap bundle
const snapConfig: Configuration = merge(common, {
  entry: {
    snap: './src/index.ts',
  },
  output: {
    // Required so that webpack doesn't mangle our `exports` variable
    libraryTarget: 'commonjs',
  },
  plugins: [new SnapsWebpackPlugin({ eval: false })],
});

const config = [snapConfig];
export default config;
