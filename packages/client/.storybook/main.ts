/** eslint-env node */

process.env.IS_STORYBOOK = 'true';

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react-vite',
  core: {
    builder: '@storybook/builder-vite',
  },
};
