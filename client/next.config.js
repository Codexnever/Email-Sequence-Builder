/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://your-production-backend.com/api/:path*"
            : "http://localhost:5000/api/:path*", // Proxy to Backend in development
      },
    ];
  },
};

module.exports = nextConfig;
