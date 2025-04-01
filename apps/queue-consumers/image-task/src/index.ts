import { Task, ConsumerService } from "@repo/service";
import Env = Cloudflare.Env;
type Message<T> = {
  type: string;
  payload: T
};
type ImageTask = Task

export default {
  async queue(batch: MessageBatch<Message<ImageTask>>, env: Env): Promise<void> {
    const consumerService = new ConsumerService(env)
    for (const msg of batch.messages) {
      console.log("receive message", msg)
      msg.ack()
      try {
        await consumerService.handleMsg(msg.body)
      }catch (e) {
        msg.retry({delaySeconds: 30})
      }
      console.log("message-handler-over", msg)
    }
  },
};