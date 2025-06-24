/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    OMDB_API_KEY: process.env.OMDB_API_KEY,
  },
};

module.exports = nextConfig;