/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.js'],
  eslint: { ignoreDuringBuilds: true },
}

module.exports = nextConfig
