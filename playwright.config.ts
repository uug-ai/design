import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: ['widgets.spec.ts'],
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4381',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/preview-all.mjs',
    env: { PORT: '4381' },
    url: 'http://127.0.0.1:4381/',
    reuseExistingServer: false,
  },
})
