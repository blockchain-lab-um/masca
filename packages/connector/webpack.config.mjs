import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        exclude: /node_modules/,
        options: {
          tsconfig: './tsconfig.json',
          loader: 'ts',
          target: 'es2020',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'bundle'),
    globalObject: 'this',
    library: {
      name: 'webpackNumbers',
      type: 'umd',
    },
  },
};
