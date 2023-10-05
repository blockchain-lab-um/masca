// vite.config.ts
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/e2e/**/*.spec.ts', 'tests/unit/**/*.spec.ts'],
    silent: true,
    cache: false,
    environment: 'node', // or 'happy-dom', 'jsdom'
    server: {
      deps: {
        fallbackCJS: true,
        external: ['did-resolver', 'did-jwt-vc'],
      },
    },
    setupFiles: ['./tests/globalSetup.ts'],
    testTimeout: 15000,
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
      },
    },
    logHeapUsage: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      clean: true,
    },
  },
});
