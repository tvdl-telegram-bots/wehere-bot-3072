const path = require("path");

const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["wehere-cms"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ftl/,
      type: "asset/source",
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      graphql$: path.join(__dirname, "../node_modules/graphql/index.js"),
    };
    config.plugins = [...config.plugins, new PrismaPlugin()];
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
