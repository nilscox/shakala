const TSConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');

const tsconfig = require('./tsconfig.json');

tsconfig.compilerOptions.jsx = 'react-jsx';

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'development',
  devtool: 'source-map',

  cache: {
    type: 'filesystem',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [new TSConfigPathsWebpackPlugin({ logInfoToStdOut: true })],
  },

  plugins: [new WebpackBar()],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es6',
          tsconfigRaw: tsconfig,
        },
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },

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
    ],
  },
};
