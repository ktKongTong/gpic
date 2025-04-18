

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.S3_USER_CONTENT_HOSTNAME,
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
                destination: `${process.env.BACKEND_HOST}/api/:path*`,
            },
        ]
    },
};



export default nextConfig;


const loadCFEnv = async () => {
  const {initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare")
    initOpenNextCloudflareForDev().then(() => {
        console.log("Cloudflare loaded");
    })
}
try {
    loadCFEnv().catch(e => {
        console.log(e)
    })
}catch (e) {
    console.log(e)
}
