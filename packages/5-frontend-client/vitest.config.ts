import svgr from 'vite-plugin-svgr';

import config from '../../vitest.config';

export default config({
  test: {
    environment: 'jsdom',
  },
  plugins: [svgr({ exportAsDefault: true })],
});
