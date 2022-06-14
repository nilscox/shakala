const path = require('path');
const { ProvidePlugin } = require('webpack');

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

    config.module.rules = config.module.rules.filter(
      (rule) => rule.test?.toString() !== '/\\.(mjs|tsx?|jsx?)$/',
    );

    config.module.rules.push({
      test: /\.[jt]sx?$/,
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es6',
      },
    });

    config.plugins.push(new ProvidePlugin({ React: 'react' }));

    return config;
  },
};
