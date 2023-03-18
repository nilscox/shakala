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
    watch: false,
    deps: {
      registerNodeLoader: true,
    },
  },
});
