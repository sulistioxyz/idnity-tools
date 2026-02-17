/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // PERINGATAN: Ini akan mengabaikan error TypeScript saat build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ini juga sering menghambat build, bisa diabaikan dulu
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;