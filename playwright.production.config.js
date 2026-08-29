import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'http://127.0.0.1:4174',
  },
  webServer: {
    ...baseConfig.webServer,
    command: 'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
    reuseExistingServer: false,
    url: 'http://127.0.0.1:4174',
  },
})
