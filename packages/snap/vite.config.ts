// vite.config.ts
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    silent: true,
    environment: 'node', // or 'happy-dom', 'jsdom'
    server: {
      deps: {
        fallbackCJS: true,
        external: ['did-resolver', 'did-jwt-vc'],
      },
    },
    setupFiles: ['./tests/globalSetup.ts'],
    testTimeout: 15000,
    logHeapUsage: true,
  },
});
