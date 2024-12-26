/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@react-email/components'],
  images: {
    remotePatterns: [
      {
        hostname: 'pub-147810667ad1442d941a473fc0f17b93.r2.dev'
      }
    ]
  }
};

export default nextConfig;
