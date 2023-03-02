import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    reporters: ['verbose'],
    deps: {
      registerNodeLoader: true,
    },
  },
});