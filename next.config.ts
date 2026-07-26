import type { NextConfig } from "next";

const repositoryName = "LVMH-prototype";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,

    basePath: isProduction ? `/${repositoryName}` : "",
    assetPrefix: isProduction ? `/${repositoryName}/` : "",

    images: {
        unoptimized: true,
    },
};

export default nextConfig;