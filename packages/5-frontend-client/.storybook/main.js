const path = require('path');
const { ProvidePlugin } = require('webpack');

const webpackConfig = require('../webpack.config');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],

  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],

  framework: '@storybook/react',

  core: {
    builder: '@storybook/builder-webpack5',
  },

  reactOptions: {
    fastRefresh: true,
  },

  webpackFinal: (config) => {
    Object.assign(config.resolve.alias, {
      '~': path.resolve(__dirname, '..', 'src'),
    });

    config.module.rules = webpackConfig.module.rules;

    config.plugins.push(new ProvidePlugin({ React: 'react' }));

    if (process.env.PUBLIC_PATH) {
      config.output.publicPath = process.env.PUBLIC_PATH;
    }

    return config;
  },
};
