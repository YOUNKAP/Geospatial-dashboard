/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGDB_URI: process.env.MONGDB_URI,
  },
};

module.exports = nextConfig;
