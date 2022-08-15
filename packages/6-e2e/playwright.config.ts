import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: 'http://localhost:8000',
    browserName: 'chromium',
  },
  workers: 1,
};

export default config;
