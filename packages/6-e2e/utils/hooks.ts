import { test } from '@playwright/test';

test.afterAll(({ headless }) => {
  if (!headless) {
    return new Promise(() => {});
  }
});
