import path from 'node:path';

import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

const isStorybook = process.env.IS_STORYBOOK;

const plugins: PluginOption[] = isStorybook
  ? [svgr({ exportAsDefault: true })]
  : [react(), ssr(), svgr({ exportAsDefault: true })];

export default defineConfig({
  plugins,
  build: {
    sourcemap: true,
  },
  test: {
    watch: false,
    reporters: ['verbose'],
    environment: 'happy-dom',
    setupFiles: [
      path.join('..', 'shared', 'src', 'vitest.setup.ts'),
      path.join('src', 'utils', 'vitest.setup.ts'),
    ],
    deps: {
      registerNodeLoader: true,
    },
  },
});
