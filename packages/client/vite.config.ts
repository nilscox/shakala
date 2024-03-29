import path from 'node:path';

import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const isStorybook = process.env.IS_STORYBOOK;

const plugins = isStorybook
  ? [tsconfigPaths(), svgr({ exportAsDefault: true })]
  : [tsconfigPaths(), react(), ssr(), svgr({ exportAsDefault: true })];

export default defineConfig({
  plugins,
  build: {
    sourcemap: true,
  },
  ssr: {
    noExternal: ['@fortawesome/*'],
  },
  test: {
    watch: false,
    reporters: ['verbose'],
    environment: 'happy-dom',
    globalSetup: [path.join('src', 'utils', 'vitest.global-setup.ts')],
    setupFiles: [path.join('src', 'utils', 'vitest.setup.ts')],
    alias: {
      '@shakala/shared/vitest.setup': path.resolve('..', 'shared', 'vitest.setup.ts'),
    },
    deps: {
      registerNodeLoader: true,
    },
  },
});
