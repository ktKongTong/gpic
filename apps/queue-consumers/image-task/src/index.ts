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
    const handler = async (msg:MessageBatch<Message<ImageTask>>['messages'][number]) => {
      console.log("receive message", msg.id, msg.attempts, msg.timestamp, msg.body)
      msg.ack()
      try {
        await consumerService.handleMsg(msg.body)
      }catch (e) {
        console.error(e)
        msg.retry({delaySeconds: 30})
      }

      console.log("message-handler-over", msg.id, msg.attempts, msg.timestamp)
    }
    await Promise.all(batch.messages.map(it => handler(it)))
  },
};