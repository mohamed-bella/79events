import {defineConfig, devices} from '@playwright/test';

const port = Number(process.env.TEST_PORT || (process.env.CI ? 3100 : 3000));
const host = 'localhost';

export default defineConfig({
  testDir:'./tests/e2e',
  fullyParallel:true,
  workers:2,
  forbidOnly:Boolean(process.env.CI),
  retries:process.env.CI ? 1 : 0,
  reporter:'list',
  use:{
    baseURL:`http://${host}:${port}`,
    trace:'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  projects:[{name:'chromium', use:{...devices['Desktop Chrome']}}],
  webServer:{
    command:`npm run dev -- --port ${port}`,
    url:`http://${host}:${port}`,
    reuseExistingServer:!process.env.CI,
    timeout:120_000,
    env:{
      NEXT_PUBLIC_SITE_URL:'https://www.79events.test',
      RESEND_API_KEY:'',
      RESEND_FROM_EMAIL:'',
      LEAD_NOTIFICATION_EMAIL:'',
      UPSTASH_REDIS_REST_URL:'',
      UPSTASH_REDIS_REST_TOKEN:'',
    },
  },
});
