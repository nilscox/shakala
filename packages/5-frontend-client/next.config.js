/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      loader: '@svgr/webpack',
      options: {
        svgoConfig: {
          cleanupIDs: false,
          plugins: [{ name: 'removeViewBox', active: false }],
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
