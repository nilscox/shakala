import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), ssr(), svgr({ exportAsDefault: true })],
  build: {
    sourcemap: true,
  },
  test: {
    reporters: ['verbose'],
    environment: 'happy-dom',
    setupFiles: ['./src/utils/expect.ts'],
    watch: false,
    deps: {
      registerNodeLoader: true,
    },
  },
});
