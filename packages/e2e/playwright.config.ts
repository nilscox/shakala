import type { PlaywrightTestConfig, ReporterDescription } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
  testDir: 'specs',
  timeout: 20_000,
  use: {
    baseURL: process.env.APP_BASE_URL ?? 'http://localhost:8000',
    browserName: 'chromium',
  },
  maxFailures: 1,
  workers: 1,
  reporter: [['list']],
};

if (process.env.CI === 'true') {
  config.forbidOnly = true;

  config.use = {
    ...config.use,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  };

  delete config.maxFailures;

  const reporter = config.reporter as ReporterDescription[];
  reporter.push(['github']);
}

export default config;
