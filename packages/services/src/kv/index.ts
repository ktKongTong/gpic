import {getCloudflareEnv} from "../utils";
import {CFKVStore} from "./cf";

export interface KVService {
  get<T>(key: string): Promise<T | null>,
  mget<T>(key: string): Promise<T>,
  set<T extends unknown>(key: string, value: T): Promise<void>
  increaseBy(key: string, value: number, option?: {
    min?: { num: number, message?: string },
    max?: { num: number, message?: string }
  }): Promise<number>
}

export const createKVService = (env?: CloudflareEnv):KVService => {
  let _env = env ?? getCloudflareEnv()
  // const doid = _env.DO_ATOMIC_KV.idFromName('atomic_kv')
  // const stub = _env.DO_ATOMIC_KV.get(doid)
  // return stub as KVService
  return new CFKVStore(_env)
}