import {Hono} from "hono";
import {z} from "zod";
import { getService } from "../middlewares/service-di";
import { streamSSE } from 'hono/streaming'

const app = new Hono().basePath('/ai')



function getRandomDelay(minSeconds = 1, maxSeconds = 10) {
  const minMs = minSeconds * 1000;
  const maxMs = maxSeconds * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const schema = z.object({
  files: z.string().array().max(5, "Maximum 5 files"),
  style: z.string().array().min(1).max(10, "Maximum 10 style"),
  prompt: z.string().optional(),
  batch: z.boolean().optional().default(false),
})


app.post('/image/flavor-style', async (c) => {
  const body = await c.req.json()
  const data = schema.parse(body)
  const  { aiImageService } = getService(c)
  const result = await aiImageService.generateImage({
    ...data,
    style: data.style[0]
  })
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