import {getCloudflareContext} from "@opennextjs/cloudflare";

const envSymbol = Symbol.for("cloudflare_queue_env");

export const getCloudflareEnv = (): CloudflareEnv => {
  const global = globalThis;
  // @ts-ignore
  return global[envSymbol] ?? getCloudflareContext().env
}

export const setCloudflareEnv = (env: CloudflareEnv) => {
  const global = globalThis;
  // @ts-ignore
  globalThis[envSymbol] = env
}