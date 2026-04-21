import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a minimal standalone server at .next/standalone for the Docker
  // build — matches the multi-stage Dockerfile's runtime copy.
  output: "standalone",
  // Anchor file tracing at the project directory. Without this, Next can
  // walk up past the repo and emit server.js nested inside a recreated
  // Documents/Vinay/... path tree, which breaks the Docker COPY step.
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Allow the v0.app-hosted hero/landing media through Next's image
    // optimizer — it serves AVIF/WebP at the right size per viewport,
    // lazy-loads by default, and trims the bytes on the wire dramatically.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
