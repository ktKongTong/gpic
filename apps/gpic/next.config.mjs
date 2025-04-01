import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev().then(() => {
    console.log("Cloudflare loaded");
})
const nextConfig = {
  /* config options here */
};



export default nextConfig;
