import { MQService } from ".";
import { Client } from "@upstash/qstash";
import {BaseError} from "../../../errors/base";

export class UpstashMqImpl<T> implements MQService<T> {
  client: Client;
  env: CloudflareEnv

  constructor(env: CloudflareEnv) {
    this.env = env;
    // @
    if(env.MQ_PROVIDER !== 'upstash') {
      throw new BaseError(`Error Config: expect MQ Provider: upstash, receive: ${env.MQ_PROVIDER}`)
    }
    if(!env.UPSTASH_QSTASH_TOKEN) {
      throw new BaseError(`Error Config: current MQ Provider: upstash, require UPSTASH_QSTASH_TOKEN`)
    }
    this.client = new Client({ token: env.UPSTASH_QSTASH_TOKEN! })
  }

  async enqueue(message: T) {
    // @ts-ignore
    const {deduplicationId,...body} = message
    const res = await this.client.publishJSON({
      url: `${this.env.BACKEND_HOST}/api/v1/upstash`,
      body: [body],
      deduplicationId
    })
    console.log(res)
  }

  async batch(messages: T[]) {
    const res = await this.client.publishJSON({
      url: `${this.env.BACKEND_HOST}/api/v1/upstash`,
      body: messages,
    })
    console.log(res)
  }
}