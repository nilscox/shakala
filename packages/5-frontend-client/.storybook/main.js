const path = require('path');

const webpackConfig = require('../webpack.config');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],

  staticDirs: ['../public'],

  addons: ['@storybook/addon-essentials'],

  framework: '@storybook/react',

  core: {
    builder: 'webpack5',
    disableTelemetry: true,
    enableCrashReports: false,
  },

  reactOptions: {
    fastRefresh: true,
  },

  webpackFinal: (config) => {
    config.devtool = webpackConfig.devtool;
    // config.cache = webpackConfig.cache;

    config.module.rules = webpackConfig.module.rules;
    // config.resolve.plugins = webpackConfig.resolve.plugins;

    config.resolve.alias = {
      ...config.resolve.alias,
      shared: path.resolve(__dirname, '..', '..', '0-shared', 'src'),
      'frontend-domain': path.resolve(__dirname, '..', '..', '4-frontend-domain', 'src'),
      '~/utils/config': path.resolve(__dirname, 'storybook-config'),
      '~': path.resolve(__dirname, '..', 'src'),
    };

    return config;
  },
};
