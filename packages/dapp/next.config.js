const path = require('path');
const withNextIntl = require('next-intl/plugin')();

// Content-Security-Policy
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdn.vercel-insights.com vercel.live accounts.google.com/gsi/client;
  child-src 'none';
  img-src 'self' assets.vercel.com data:;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  connect-src *;
  frame-src vercel.live;
`;

const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  // https://nextjs.org/docs/messages/next-image-unconfigured-host
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost'],
    loader: 'default',
  },
  optimizeFonts: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
  env: {
    USE_LOCAL: process.env.USE_LOCAL || 'false',
  },
  typescript: {
    // We can ignore build errors because we are using tsc to type check
    ignoreBuildErrors: true,
  },
  eslint: {
    // We can ignore linting errors because we are using eslint to lint
    ignoreDuringBuilds: true,
  },

  // Security headers and CSP
  // https://nextjs.org/docs/advanced-features/security-headers
  // Not supported with `next export`
  headers: async () => {
    return isProd
      ? [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains; preload',
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
              },
              {
                key: 'X-Frame-Options',
                value: 'DENY',
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-DNS-Prefetch-Control',
                value: 'on',
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin',
              },
              {
                key: 'Content-Security-Policy',
                value: contentSecurityPolicy.replace(/\n/g, ''),
              },
              {
                key: 'Cross-Origin-Opener-Policy',
                value: 'same-origin-allow-popups',
              },
            ],
          },
        ]
      : [];
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
