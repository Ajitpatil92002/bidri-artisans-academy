import type { NextConfig } from "next";

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
if (process.env.S3_PUBLIC_URL) remotePatterns.push(new URL(`${process.env.S3_PUBLIC_URL}/**`));

const nextConfig: NextConfig = {
  // See D-024: stock and prices are always read per request
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  images: { remotePatterns },
  experimental: {
    // Allows the admin to upload product photos up to 5 MB
    serverActions: { bodySizeLimit: "6mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
