import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// On GitHub, the site lives at /<repository-name>. The name is read automatically
// during the GitHub build, so renaming the repository will not break the site.
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "arcafe";
const basePath = isProd ? "/" + repoName : "";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};

export default nextConfig;
