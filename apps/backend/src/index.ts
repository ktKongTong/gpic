import {CFAdapter} from "@repo/service/quque/adapter/cf";
import {ConsumerService, route} from "@repo/service";
export { DOTaskStatus } from './do'
import Env = Cloudflare.Env;
import {MQMessage} from "@repo/service/shared";

export default {
  fetch: route.fetch,
  async queue(batch: MessageBatch<MQMessage>, env: Env): Promise<void> {
    const consumer = await CFAdapter(batch)
    const consumerService = new ConsumerService(env)
    const consumeItem = (msg: MQMessage) => consumerService.handleMsg(msg)
    await consumer.consume(consumeItem)
  },
};