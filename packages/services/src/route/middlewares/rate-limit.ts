import { rateLimiter } from "hono-rate-limiter";
import { Context, Next } from "hono";
import { getService } from "./service-di";
import {getCloudflareEnv} from "../../utils";
import {CloudflareKVStore} from "./worker-kv-store";


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
    const user = await userService.getCurrentUser(c.req.raw)
    return user?.id?? "anonymous"
}

export const rateLimitFactory = (options?: RateLimitOptions) => {
    return async (c: Context, next: Next) => {
      return rateLimiter<{ Bindings: Bindings }>({
        windowMs: options?.windowMs ?? 15 * 60 * 1000,
        limit: options?.max?? 100,
        standardHeaders: "draft-6",
        keyGenerator: options?.strategy == 'user'? userRateLimit: ipRateLimit,
        // store: new WorkersKVStore({namespace: getCloudflareEnv().KV, prefix: options?.prefix?? ""})
        // @ts-ignore
        store: new CloudflareKVStore({ namespace: getCloudflareEnv().KV , prefix: options?.prefix?? ""}),
      })(c, next)
    }
}