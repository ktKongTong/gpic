import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev().then(() => {
    console.log("Cloudflare loaded");
})
const nextConfig = {
  /* config options here */
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'https://gpic-preview.ktlab.io/api/:path*',
    //         },
    //     ]
    // },
};



export default nextConfig;
