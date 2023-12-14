/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.infura.io', 'th.bing.com', 'crowdfunding.infura-ipfs.io', 'coffee-elaborate-hyena-159.mypinata.cloud']
  }
};

module.exports = nextConfig;
