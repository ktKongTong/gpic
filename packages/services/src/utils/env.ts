import {getCloudflareContext} from "@opennextjs/cloudflare";

const envSymbol = Symbol.for("custom_cloudflare_env");

export const getCloudflareEnv = (): CloudflareEnv => {
  const global = globalThis;
  // @ts-ignore
  return global[envSymbol] ?? getCloudflareContext().env
}

export const setCloudflareEnv = (env: CloudflareEnv) => {
  // @ts-ignore
  globalThis[envSymbol] = env
}