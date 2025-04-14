import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev().then(() => {
    console.log("Cloudflare loaded");
})
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picit-usercontent.ktlab.io',
                port: '',
                pathname: '/**',
                search: '',
            },
        ],
    },
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://gpic-queue-preview.ktlab.io/api/:path*',
            },
        ]
    },
};



export default nextConfig;
