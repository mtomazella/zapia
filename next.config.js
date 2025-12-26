require('dotenv').config()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.js', 'api.js', 'api.ts'],
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@owlbear-rodeo/sdk'],
  async headers() {
    return [
      {
        source: '/:path*', // Apply to all paths
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow all origins
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
