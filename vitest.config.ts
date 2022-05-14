import { defineConfig } from 'vite';
import reactJsx from 'vite-react-jsx';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [tsconfigPaths(), reactJsx()],
});
