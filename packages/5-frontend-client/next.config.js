const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const pkg = require('./package.json');

const {
  NODE_ENV = 'development',
  API_URL = 'http://localhost:3000',
  ANALYTICS_URL,
  ANALYTICS_SITE_ID,
} = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  images: {
    disableStaticImages: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  serverRuntimeConfig: {
    apiBaseUrl: API_URL,
  },

  publicRuntimeConfig: {
    isDevelopment: NODE_ENV === 'development',
    version: pkg.version,
    apiBaseUrl: '/api',
    analyticsUrl: ANALYTICS_URL,
    analyticsSiteId: Number(ANALYTICS_SITE_ID),
  },

  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
      {
        source: '/version',
        destination: '/api/version',
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      loader: '@svgr/webpack',
      options: {
        svgoConfig: {
          cleanupIDs: false,
          plugins: [{ name: 'removeViewBox', active: false }],
        },
      },
    });

    config.module.rules.push({
      test: /\.png$/,
      type: 'asset/resource',
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
