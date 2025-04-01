import {getCloudflareEnv} from "@/api/utils";


type Message<T> = {
  type: string;
  payload: T;
}

export class MQService {
  constructor() {
  }

  async enqueue<T>(message: Message<T>): Promise<void> {
    // @ts-ignore
    return getCloudflareEnv().MQ.send(message, {contentType: 'json'})
  }

}