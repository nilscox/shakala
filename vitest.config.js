import path from 'node:path';

import { defineConfig } from 'vitest/config';

process.env.TZ = 'UTC';

const packageSource = (pkg, ...rest) => {
  return path.resolve(__dirname, 'packages', pkg, 'src', ...rest);
};

export default defineConfig({
  test: {
    watch: false,
    testTimeout: 2000,
    threads: false,
    setupFiles: [packageSource('shared', 'vitest.setup.ts'), packageSource('common', 'vitest.setup.ts')],
    reporters: ['verbose'],
    alias: {
      '@shakala/common': packageSource('common'),
      '@shakala/email': packageSource('email'),
      '@shakala/notification': packageSource('notification'),
      '@shakala/persistence/test': packageSource('persistence', 'index.test.ts'),
      '@shakala/persistence': packageSource('persistence'),
      '@shakala/shared': packageSource('shared'),
      '@shakala/thread': packageSource('thread'),
      '@shakala/user': packageSource('user'),
    },
    deps: {
      registerNodeLoader: true,
    },
  },
});
