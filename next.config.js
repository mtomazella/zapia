require('dotenv').config()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.js', 'api.js', 'api.ts'],
  eslint: { ignoreDuringBuilds: true },
}

module.exports = nextConfig
