import { mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';

import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, {
  plugins: [dts()],
  build: {
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['yup'],
    },
  },
  test: {
    watch: false,
    deps: {
      registerNodeLoader: true,
    },
  },
});
