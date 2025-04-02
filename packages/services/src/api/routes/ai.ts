import {Hono} from "hono";
import {z} from "zod";
import { getService } from "../middlewares/service-di";
import { stream,streamSSE} from 'hono/streaming'
import {mockEvent} from "../routes/mock";

const app = new Hono().basePath('/ai')



function getRandomDelay(minSeconds = 1, maxSeconds = 10) {
  const minMs = minSeconds * 1000;
  const maxMs = maxSeconds * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/image/flavor-style/mock', async (c) => {
  return streamSSE(c, async (stream) => {
    await stream.writeSSE({event: 'start', id: Date.now().toString(), data: 'drawing'})
    for(const event of mockEvent) {
        const delay = getRandomDelay(1, 10);
        await wait(delay)
        await stream.writeSSE(event)
    }
    await stream.close()
  })
})

export const schema = z.object({
  files: z.string().array().max(3, "Maximum 3 files"),
  style: z.string().optional(),
  prompt: z.string().optional(),
})


app.post('/image/flavor-style', async (c) => {
  const body = await c.req.json()
  const data = schema.parse(body)
  const  { aiImageService } = getService(c)
  // 作为task。返回一个task，然后watch
  const result = await aiImageService.generateImage(data)
  return streamSSE(c, async (stream) => {
      let id = 1
      await stream.writeSSE({event: 'start', id: Date.now().toString(), data: 'drawing'})
      for await (const event of result.fullStream) {
        switch (event.type) {
          case 'error':
            await stream.writeSSE({event: 'error', id: Date.now().toString(), data: JSON.stringify(event)});break
          case "finish":
            await stream.writeSSE({event: 'end', id: Date.now().toString(), data: event.finishReason});break
          case 'text-delta':
            const res = await aiImageService.handleTextDelta(event.textDelta)
            if(res.event == 'success') {
              // write to history
            }
            await stream.writeSSE(res)
        }
      }
      await stream.close()
    })
})




app.get('/image/quota', async (c) => {
  const  {userQuotaService} = getService(c)
  const result = await userQuotaService.getQuota()
  return c.json(result)
})

export {app as aiRoute}