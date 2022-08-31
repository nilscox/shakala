import svgr from 'vite-plugin-svgr';

import config from '../../vitest.config';

process.env.TZ = 'UTC';

export default config({
  test: {
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
  },
  plugins: [svgr({ exportAsDefault: true })],
});
