import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ssi-snap/',
  optimizeDeps: {
    include: ['@blockchain-lab-um/ssi-snap-connector'],
  },
  build: {
    commonjsOptions: {
      include: ['@blockchain-lab-um/ssi-snap-connector', /node_modules/],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
