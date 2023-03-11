import path from 'node:path';

import { defineConfig } from 'vitest/config';

const packageSource = (pkg) => {
  return path.resolve(__dirname, 'packages', pkg, 'src');
};

export default defineConfig({
  test: {
    watch: false,
    testTimeout: 2000,
    reporters: ['verbose'],
    alias: {
      '@shakala/common': packageSource('common'),
      '@shakala/email': packageSource('email'),
      '@shakala/notification': packageSource('notification'),
      '@shakala/shared': packageSource('shared'),
      '@shakala/thread': packageSource('thread'),
      '@shakala/user': packageSource('user'),
    },
    deps: {
      registerNodeLoader: true,
    },
  },
});
