// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // or 'happy-dom', 'jsdom'
    cache: false,
    server: {
      deps: {
        fallbackCJS: true,
        external: ['did-resolver', 'did-jwt-vc'],
      },
    },
    setupFiles: ['./tests/globalSetup.ts'],
    testTimeout: 15000,
  },
});
