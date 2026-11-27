import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/security',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4337',
    browserName: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4337',
    url: 'http://127.0.0.1:4337',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
