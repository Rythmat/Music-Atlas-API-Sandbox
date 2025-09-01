/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;


console.log('>> Next config loaded (ignoreDuringBuilds=true)');
