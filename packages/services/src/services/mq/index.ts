import { msgType, MQMessage } from "../../shared";
import { setCloudflareEnv } from "../../utils";
import { ImageTaskHandlerV1 } from "./task-handler.v1";
import { BatchHandlerV1 } from "./batch-handler.v1";


export class ConsumerService {
  imageTaskHandler: ImageTaskHandlerV1
  batchTaskHandler: BatchHandlerV1
  constructor(private readonly env: CloudflareEnv) {
    setCloudflareEnv(env)
    this.imageTaskHandler = new ImageTaskHandlerV1(env)
    this.batchTaskHandler = new BatchHandlerV1(env)
  }

  async handleMsg(msg: MQMessage) {
    switch (msg.type) {
      case msgType.IMAGE_GEN:
        return await this.imageTaskHandler.handleSingleImageGenTask(msg.payload)
      case msgType.BATCH_IMAGE_GEN:
        return await this.batchTaskHandler.handleBatchImageGenTask(msg.payload)
      case msgType.TASK_RETRY:
        return await this.imageTaskHandler.handleTaskRetry(msg.payload)
      case msgType.BATCH_TASK_RETRY:
        return await this.batchTaskHandler.handleBatchTaskRetry(msg.payload.task, msg.payload.failOnly)
      case msgType.TASK_COMPLETE:
        // call webhook/send email
        // hook define
    }
  }
}