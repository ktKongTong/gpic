import {DurableObject} from "cloudflare:workers";
import {KVService} from "../libs/kv";


export class AtomicKVDO extends DurableObject implements KVService {
  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    super(ctx, env);
  }

    get<T>(key: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    mget<T>(key: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
    set<T extends unknown>(key: string, value: T): Promise<void> {
        throw new Error("Method not implemented.");
    }
    increaseBy(key: string, value: number, options?: {
      min?: {num: number, message?: string},
      max?: {num: number, message?: string},
    }): Promise<number> {
      throw new Error("Method not implemented.");
    }
}