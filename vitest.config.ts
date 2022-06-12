// import reactJsx from 'vite-react-jsx';
import path from 'path';

import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    mockReset: true,
    setupFiles: [path.resolve(__dirname, 'vitest.setup.ts')],
    environment: 'happy-dom',
  },
  plugins: [tsconfigPaths()],
  // plugins: [tsconfigPaths(), reactJsx()],
});
