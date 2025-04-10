import {Hono} from "hono";
import {getService} from "../../middlewares/service-di";
import {msgType} from "../../services";
import {z} from "zod";

const app = new Hono().basePath('/task')

const styleSchema = z.union(
[z.object({
  styleId: z.string(),
}), z.object({
  prompt: z.string(),
  reference: z.string().array(),
})])

export const schema = z.object({
  files: z.string().array().min(1).max(10, "Maximum 10 files"),
  styles: styleSchema.array().min(1).max(5, "Maximum 5 style"),
  size: z.string().optional(),
  count: z.coerce.number().min(1).max(100, "Maximum 100 count").optional().default(1),
  batch: z.coerce.boolean().optional().default(false),
}).refine((data) => {
  const total = data.styles.length * data.files.length * data.count
  return total <= 100
},{
  message: "total task count should be less than 100",
})

app.post('/image/flavor-image', async (c) => {
  const body = await c.req.json()
  const data = schema.parse(body)
  const  {mqService, taskService } = getService(c)
  if(data.batch) {
    const task = await taskService.createBatchTask({input:data})
    await mqService.enqueue({type: msgType.BATCH_IMAGE_GEN, payload: task})
    return c.json(task)
  }
  const task = await taskService.createImageGenTask({input:{files: data.files, size: data.size, style: data.styles[0]}})
  await mqService.enqueue({type: msgType.IMAGE_GEN, payload: task})
  return c.json(task)
})

export { app as taskV2Route }