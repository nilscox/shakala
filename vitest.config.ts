import reactJsx from 'vite-react-jsx';
import tsconfigPaths from 'vite-tsconfig-paths';
import { InlineConfig } from 'vitest';
import { defineConfig } from 'vitest/config';

export default (overrides?: InlineConfig) => {
  return defineConfig({
    test: {
      globals: true,
      watch: false,
      mockReset: true,
      reporters: 'verbose',
      threads: false,
      ...overrides,
    },
    plugins: [tsconfigPaths(), reactJsx()],
  });
};
