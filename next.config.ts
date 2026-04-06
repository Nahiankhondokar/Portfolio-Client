import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000', // Match your backend port
                pathname: '/storage/**', // Match your Laravel/Backend storage path
            },
        ],
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: process.env.NODE_ENV != 'production' ? 'http' : 'https',
                hostname: process.env.NEXT_PUBLIC_API_DOMAIN || 'localhost',
                port: process.env.NODE_ENV != 'production' ? '8000' : '',
                pathname: '/storage/**',
            },
        ],
    },
    typescript: {
        // This will ignore TypeScript errors during the build
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
