const path = require('path');

const webpackConfig = require('../webpack.config');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-essentials'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  reactOptions: {
    fastRefresh: true,
  },

  webpackFinal: (config) => {
    config.cache = webpackConfig.cache;

    config.module.rules = config.module.rules.filter((rule) => !rule.test.toString().match(/svg/));

    config.module.rules.push(
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            cleanupIDs: false,
            plugins: [{ name: 'removeViewBox', active: false }],
          },
        },
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
    );

    return config;
  },
};
