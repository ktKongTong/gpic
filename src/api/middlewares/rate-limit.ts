// rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//     standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//     keyGenerator: (c) => "<unique_key>", // Method to generate custom identifiers for clients.
//     // store: ... , // Redis, MemoryStore, etc. See below.
//   })


import { WorkersKVStore } from "@hono-rate-limiter/cloudflare";
import { rateLimiter } from "hono-rate-limiter";
import { Context, Next } from "hono";
import { getService } from "./service-di";
import {getCloudflareContext} from "@opennextjs/cloudflare";


type Bindings = {
  KV: KVNamespace;
};



type RateLimitOptions = {
    max?: number,
    windowMs?: number,
    prefix?: string,
    strategy?: 'ip' | 'user',
}

const ipRateLimit = (c:Context) => c.req.header("cf-connecting-ip") ?? "unknown"
const userRateLimit = async (c:Context) => {
    const {userService} = getService(c)
    const user = await userService.getCurrentUser(c)
    return user?.id?? "anonymous"
}

export const rateLimitFactory = (options?: RateLimitOptions) => {
    return async (c: Context, next: Next) => {
      return rateLimiter<{ Bindings: Bindings }>({
        windowMs: options?.windowMs ?? 15 * 60 * 1000,
        limit: options?.max?? 100,
        standardHeaders: "draft-6",
        keyGenerator: options?.strategy == 'user'? userRateLimit: ipRateLimit,
        store: new WorkersKVStore({ namespace: getCloudflareContext().env.KV , prefix: options?.prefix?? ""}),
      })(c, next)
    }
}