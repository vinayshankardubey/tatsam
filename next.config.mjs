/** @type {import('next').NextConfig} */
const nextConfig = {
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
