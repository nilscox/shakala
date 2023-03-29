import path from 'node:path';

import { defineConfig } from 'vitest/config';

process.env.TZ = 'UTC';

const packageDirectory = (pkg, ...rest) => {
  return path.resolve(__dirname, 'packages', pkg, ...rest);
};

const packageSource = (pkg, ...rest) => {
  return path.resolve(packageDirectory(pkg, 'src', ...rest));
};

export default defineConfig({
  test: {
    watch: false,
    testTimeout: 2000,
    hookTimeout: 2000,
    threads: false,
    setupFiles: [packageDirectory('shared', 'vitest.setup.ts'), packageSource('common', 'vitest.setup.ts')],
    reporters: ['verbose'],
    alias: {
      '@shakala/common': packageSource('common'),
      '@shakala/email': packageSource('email'),
      '@shakala/notification': packageSource('notification'),
      '@shakala/persistence/test': packageSource('persistence', 'index.test.ts'),
      '@shakala/persistence': packageSource('persistence'),
      '@shakala/shared/vitest.setup': packageDirectory('shared', 'vitest.setup.ts'),
      '@shakala/shared': packageSource('shared'),
      '@shakala/thread': packageSource('thread'),
      '@shakala/user': packageSource('user'),
    },
    deps: {
      registerNodeLoader: true,
    },
  },
});
