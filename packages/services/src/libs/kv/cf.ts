import {KVService} from "./index";

// TODO use durable object/d1(need migration)
export class CFKVStore implements KVService {

    constructor(private env: CloudflareEnv) {
    }

    async get<T>(key: string): Promise<T | null> {
      const res = this.env.KV.get<T>(key, {type: 'json'})
      return  res
    }
    mget<T>(key: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
    async set<T extends unknown>(key: string, value: T): Promise<void> {
      await this.env.KV.put(key, JSON.stringify(value));
    }

    async increaseBy(key: string, value: number, options?: {
      min?: { num: number, message?: string },
      max?: { num: number, message?: string },
    }) {
      let currentStr = await this.env.KV.get<number>(key, {type: 'json'});
      let current  = 0
      if(currentStr) {
        current = Number(currentStr)
      }
      if(current === null || current === undefined || Number.isNaN(current)) {
        await this.env.KV.put(key, "0");
        current = 0
      }
      let res = current + value
      if((options?.min && res < options.min.num)) {
        if(options.min.message) {
          throw new Error(options.min.message)
        }
        throw new Error(`increaseBy result should greater than or equal ${options.min}`)
      }
      if((options?.max && res > options.max.num)) {
        if(options.max.message) {
          throw new Error(options.max.message)
        }
        throw new Error(`increaseBy result should less than or equal ${options.max}`)
      }
      await this.env.KV.put(key, res.toString());
      return res
    }
}