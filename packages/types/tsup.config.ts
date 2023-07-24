import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  target: 'es2020',
  treeshake: true,
  splitting: true,
  tsconfig: './tsconfig.build.json',
  entry: ['src/**/*.ts'],
  format: 'esm',
  dts: true,
  minify: false,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      '@0xpolygonid/js-sdk': '@0xpolygonid/js-sdk/dist/esm/index.js',
    };
  },
  ...options,
}));
