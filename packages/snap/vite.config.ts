// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // or 'happy-dom', 'jsdom'
    cache: false,
  },
});
