// vite.config.ts
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    watch: false,
    pool: 'forks',
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
    testTimeout: 30000,
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 8,
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
