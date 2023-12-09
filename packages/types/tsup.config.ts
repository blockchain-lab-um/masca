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
      '@0xpolygonid/js-sdk': '../../node_modules/.pnpm/@0xpolygonid+js-sdk@1.4.2_@iden3+js-crypto@1.0.3_@iden3+js-iden3-core@1.0.1_@iden3+js-jsonld-_ooz3jug64qskkvbpxyzx7wb42i/node_modules/@0xpolygonid/js-sdk/dist/types/esm/index.d.js',
    };
  },
  ...options,
}));
