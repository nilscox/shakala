/* eslint-disable */

const path = require('path');
const { EnvironmentPlugin, ProvidePlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV = 'development', VERSION = 'development', HOST = '0.0.0.0', PORT = '8000' } = process.env;

/** @type {import('webpack').Configuration} */
const config = (module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: './src/index.tsx',

  output: {
    clean: true,
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es6',
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

  plugins: [
    new EnvironmentPlugin({
      API_URL: 'http://localhost:3000',
      ANALYTICS_URL: false,
      ANALYTICS_SITE_ID: false,
    }),
    new ProvidePlugin({ React: 'react' }),
    new HtmlWebpackPlugin({
      title: 'Shakala',
    }),
    new HtmlWebpackPlugin({
      filename: 'version.txt',
      inject: false,
      templateContent: VERSION,
    }),
  ],
});

if (NODE_ENV === 'development') {
  config.output.filename = '[name].js';

  config.plugins.push(new ReactRefreshWebpackPlugin());

  config.devServer = {
    host: HOST,
    port: Number(PORT),
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  };
}

if (NODE_ENV === 'production') {
  config.mode = 'production';
}
