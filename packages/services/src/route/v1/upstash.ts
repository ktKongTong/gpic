import {Hono} from "hono";
import {upstashAdapter} from "../../queue/consumer/adapter/upstash";
import {getCloudflareEnv} from "../../utils";
import {MQMessage} from "../../shared";
import {getService} from "../middlewares/service-di";

const app = new Hono()

app.post('/quque/upstash', async (c) => {
  const { consumerService } = getService(c)
  const consumer = await upstashAdapter(c.req.raw, getCloudflareEnv())
  await consumer.consume((msg: MQMessage) => consumerService.handleMsg(msg))
  return c.json({})
})

export { app as upstashRoute }