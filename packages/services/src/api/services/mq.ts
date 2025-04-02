import {getCloudflareEnv} from "../utils";


export type MessageType = 'image-gen' | 'batch-image-gen'
export const msgType = {
  IMAGE_GEN: 'image-gen' as const,
  BATCH_IMAGE_GEN: 'batch-image-gen' as const
}
type Message<T> = {
  type: MessageType;
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