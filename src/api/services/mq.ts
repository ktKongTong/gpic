import {Context} from "hono";
import {getContext} from "hono/context-storage";
import {getCloudflareContext} from "@opennextjs/cloudflare";

type Message<T> = {
  type: string;
  payload: T;
}

export class MQService {
  constructor() {
  }

  async enqueue<T>(message: Message<T>) {
    return getCloudflareContext().env.MQ.send(message, {contentType: 'json'})

  }

}