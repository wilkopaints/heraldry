import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
  },
  webServer: {
    command: 'python3 -m http.server 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /firefox-mbp-sonoma\.spec\.js/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /firefox-mbp-sonoma\.spec\.js/,
    },
    {
      name: 'firefox-mbp2020-sonoma',
      testMatch: /firefox-mbp-sonoma\.spec\.js/,
      use: {
        ...devices['Desktop Firefox'],
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.6; rv:149.0) Gecko/20100101 Firefox/149.0',
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
      },
    },
  ],
});
