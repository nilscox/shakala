import config from '../../vitest.config';

export default config({
  setupFiles: ['../0-shared/src/vitest.setup.ts', './src/vitest.setup.ts'],
});
