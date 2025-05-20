const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    domains: [
      'mbosaasbucket.s3.us-east-2.amazonaws.com'
    ],
  }
}
require("dotenv").config();

module.exports = withNextIntl(nextConfig);
