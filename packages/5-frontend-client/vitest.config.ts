import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

import config from '../../vitest.config';

export default config({
  test: {
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
  },
  plugins: [react(), svgr({ exportAsDefault: true })],
});
