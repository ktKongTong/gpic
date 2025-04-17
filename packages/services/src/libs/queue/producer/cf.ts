import {getCloudflareEnv} from "../../../utils";
import {MQService} from "./index";

export class CFMQServiceImpl<T = unknown> implements MQService<T> {
  constructor() {
  }

  async enqueue(message: T) {
    // @ts-ignore
    return getCloudflareEnv().MQ.send(message, {contentType: 'json'})
  }

  async batch(message: T[]) {
    // @ts-ignore
    return getCloudflareEnv().MQ.sendBatch(message.map(it => ({body: it, contentType: 'json'})))
  }

}