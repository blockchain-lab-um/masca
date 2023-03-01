import { URL, fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

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
