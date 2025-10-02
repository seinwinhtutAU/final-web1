/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/fin-customer",
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
