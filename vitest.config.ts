import { PluginOption } from 'vite';
import reactJsx from 'vite-react-jsx';
import tsconfigPaths from 'vite-tsconfig-paths';
import { InlineConfig } from 'vitest';
import { defineConfig } from 'vitest/config';

process.env.TZ = 'UTC';

type Options = {
  test?: InlineConfig;
  plugins?: PluginOption[];
};

export default (options?: Options) => {
  return defineConfig({
    test: {
      globals: true,
      watch: false,
      mockReset: true,
      reporters: 'verbose',
      threads: false,
      ...options?.test,
    },
    plugins: [tsconfigPaths(), reactJsx(), ...(options?.plugins ?? [])],
  });
};
