/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ftl/,
      type: "asset/source",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wehere-bot-storage.s3.ap-southeast-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
