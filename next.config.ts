import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Include the knowledge/ directory in every serverless function bundle.
  // Without this, Vercel's output file tracing omits files read via
  // runtime fs calls (process.cwd() + path), causing the local search
  // engine to silently return empty results on every /api/chat request.
  outputFileTracingIncludes: {
    "/**": ["./knowledge/**/*"],
  },
  // Prevent webpack from bundling pdf-parse and mammoth.
  // pdf-parse reads a test PDF file at module-init time when bundled,
  // which fails in serverless environments. mammoth also uses Node.js
  // fs internals that are safer when loaded from node_modules at runtime.
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
