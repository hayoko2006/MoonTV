/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires */

const nextConfig = {
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ },
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      crypto: false,
    };

    return config;
  },
};

const isCloudflarePages = process.env.CF_PAGES === '1' || 
  process.env.CLOUDFLARE_PAGES === '1' ||
  process.argv.includes('pages:build');

const isVercel = process.env.VERCEL === '1';
const isNetlify = process.env.NETLIFY === 'true';
const isEdgeOneMakers = process.env.EDGEONE_MAKERS === '1' || process.env.EDGEONE === '1';

const isCloudPlatform = isCloudflarePages || isVercel || isNetlify || isEdgeOneMakers;

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || isCloudPlatform,
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
