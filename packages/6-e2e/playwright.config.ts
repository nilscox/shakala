import type { PlaywrightTestConfig, ReporterDescription } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'specs',
  use: {
    baseURL: 'http://localhost:8000',
    browserName: 'chromium',
  },
  workers: 1,
  reporter: [['list']],
};

if (process.env.CI === 'true') {
  config.forbidOnly = true;

  config.use = {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  };

  const reporter = config.reporter as ReporterDescription[];
  reporter.push(['github']);
}

export default config;
