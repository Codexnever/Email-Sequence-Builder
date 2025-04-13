/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";
    const backendURL = isProd
      ? process.env.NEXT_PUBLIC_API_PROD
      : process.env.NEXT_PUBLIC_API_DEV;

    return [
      {
        source: "/api/:path*",
        destination: `${backendURL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
