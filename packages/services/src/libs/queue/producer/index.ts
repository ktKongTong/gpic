import {getCloudflareEnv} from "../../utils";
import {CFMQServiceImpl} from "./cf";
import { UpstashMqImpl } from "./upstash";
import {ServiceError} from "../../errors";

export interface MQService<T> {
  enqueue(message: T): Promise<void>,
  batch(message: T[]): Promise<void>
}

export const createMQService = <T>(env?: CloudflareEnv):MQService<T> => {
  let _env = env ?? getCloudflareEnv()
  if (_env.MQ_PROVIDER === 'cf') {
    return new CFMQServiceImpl<T>()
  } else if (_env.MQ_PROVIDER === 'upstash') {
    return new UpstashMqImpl<T>(_env)
  }
  throw new ServiceError(`expect env MQ_PROVIDER to be 'cf' | 'upstash', current ${_env.MQ_PROVIDER}`)
}