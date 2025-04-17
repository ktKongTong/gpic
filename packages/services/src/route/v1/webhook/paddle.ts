import {Hono} from "hono";
import {Environment, EventName, LogLevel, Paddle} from '@paddle/paddle-node-sdk'
import {BaseError} from "../../../errors/base";
import {getService} from "../../middlewares/service-di";
import {z} from "zod";
import {getCloudflareEnv} from "../../../utils";


const app = new Hono()
  .basePath('/webhook/paddle')

const priceCustomDataSchema = z.object({
  credit: z.coerce.number(),
})
const txCustomDataSchema = z.object({
  userId: z.string()
})

app.post('/order', async (c) => {
  const signature = (c.req.raw.headers.get('paddle-signature') as string) || '';
  const buf =await c.req.arrayBuffer()
  const rawRequestBody = Buffer.from(buf).toString('utf-8');
  const secretKey = getCloudflareEnv().PADDLE_WEBHOOK_SECRET_KEY as string
    if (signature && rawRequestBody) {
      const paddle = new Paddle(getCloudflareEnv().PADDLE_API_KEY, {
        environment: getCloudflareEnv().PADDLE_ENVIRONMENT as Environment,
        logLevel: LogLevel.verbose,
      })
      const eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
      console.log(eventData);
      switch (eventData.eventType) {
        case EventName.TransactionCompleted:
          const priceCustomData = eventData.data.items[0].price?.customData
          const txCustomData = eventData.data.customData
          const {credit} = priceCustomDataSchema.parse(priceCustomData)
          const { userId } = txCustomDataSchema.parse(txCustomData)
          const {userBalanceService} = getService(c)
          await userBalanceService.createOrder({
            userId,
            amount: credit,
            msg: `create by paddle webhook, txId: ${eventData.data.id}`
          })
          break;
        default:
          console.log(eventData.eventType);
      }
    } else {
      throw new BaseError('Signature missing in header')
    }
  return c.json({})
})


export { app as paddleWebhookRoute }