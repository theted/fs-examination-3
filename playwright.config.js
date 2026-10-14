import { defineConfig, devices } from '@playwright/test'

const port = 4173

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    // tall enough that open windows don't cover the dock
    viewport: { width: 1440, height: 1200 },
    trace: 'retain-on-failure'
  },
  // test the production build
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1200 }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 1200 }
      }
    }
  ]
})
