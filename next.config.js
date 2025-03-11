/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**',
      },
      {
        protocol: 'https',
        hostname: 'g.foolcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'static.foxnews.com',
      },
      {
        protocol: 'https',
        hostname: 'media.cnn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.bwbx.io',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'wakatime.com',
        pathname: '/badge/**',
      },
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
        pathname: '/api/v1/image/**',
      }
    ]
  }
}

module.exports = nextConfig