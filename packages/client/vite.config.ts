import path from 'node:path';

import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const isStorybook = process.env.IS_STORYBOOK;

const plugins: PluginOption[] = isStorybook
  ? [tsconfigPaths(), svgr({ exportAsDefault: true })]
  : [tsconfigPaths(), react(), ssr(), svgr({ exportAsDefault: true })];

const sharedVitestSetup = path.resolve('..', 'shared', 'vitest.setup.ts');

export default defineConfig({
  plugins,
  build: {
    sourcemap: true,
  },
  test: {
    watch: false,
    reporters: ['verbose'],
    environment: 'happy-dom',
    setupFiles: [sharedVitestSetup, path.join('src', 'utils', 'vitest.setup.ts')],
    alias: {
      '@shakala/shared/vitest.setup': sharedVitestSetup,
    },
    deps: {
      registerNodeLoader: true,
    },
  },
});
