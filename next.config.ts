import type { NextConfig } from "next";

/**
 * Two build modes:
 *  • default            → regular Next.js server build (Vercel, Node hosting, `npm start`)
 *  • STATIC_EXPORT=true → fully static `out/` folder for GitHub Pages / any static host.
 *    Pair it with NEXT_PUBLIC_BASE_PATH=/<repo> when the site lives in a sub-folder.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
