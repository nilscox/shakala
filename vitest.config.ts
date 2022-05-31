import reactJsx from 'vite-react-jsx';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./app/vitest.setup.ts'],
  },
  plugins: [tsconfigPaths(), reactJsx()],
});
