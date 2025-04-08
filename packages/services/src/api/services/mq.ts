import {getCloudflareEnv} from "../utils";
import {Task} from "../storage/type";


export type MessageType = 'image-gen' | 'batch-image-gen' | 'task-retry' | 'batch-task-retry'
export const msgType = {
  IMAGE_GEN: 'image-gen' as const,
  BATCH_IMAGE_GEN: 'batch-image-gen' as const,
  BATCH_TASK_RETRY: 'batch-task-retry' as const,
  TASK_RETRY: 'task-retry' as const
}

type ImageGenMessage = {
  type: typeof msgType.IMAGE_GEN | typeof msgType.BATCH_IMAGE_GEN,
  payload: Task
}

type RetryTaskMessage = {
  type: typeof msgType.TASK_RETRY,
  payload: Task
}
type BatchRetryTaskMessage = {
  type: typeof msgType.BATCH_TASK_RETRY,
  payload: {
    task: Task,
    failOnly: boolean
  },
}

export type Message = BatchRetryTaskMessage | RetryTaskMessage | ImageGenMessage

export class MQService {
  constructor() {
  }

  async enqueue(message: Message): Promise<void> {
    // @ts-ignore
    return getCloudflareEnv().MQ.send(message, {contentType: 'json'})
  }

  async batch(message: Message[]): Promise<void> {
    // @ts-ignore
    return getCloudflareEnv().MQ.sendBatch(message.map(it => ({body: it, contentType: 'json'})), {

    })
  }

}