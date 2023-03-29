import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
