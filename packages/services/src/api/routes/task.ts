import {Hono} from "hono";
import {getService} from "../middlewares/service-di";

import {NotFoundError, ParameterError} from "../errors/route";
import {msgType} from "../services";
import {taskStatus, taskType} from "../storage/type";
import {z} from "zod";

const app = new Hono().basePath('/task')

type Style = { type: 'preset', value: string } | { type: 'prompt', value: string }

export const schema = z.object({
  files: z.string().array().min(1).max(10, "Maximum 10 files"),
  style: z.string().array().min(1).max(5, "Maximum 5 style"),
  times: z.coerce.number().min(1).max(10, "Maximum 10 times").optional().default(1),
  batch: z.boolean().optional().default(false),
}).refine((data) => {
  const total = data.style.length * data.files.length * data.times
  return total <= 100
},{
  message: "total task count should be less than 100",
})

app.post('/image/flavor-style', async (c) => {
  const body = await c.req.json()
  const data = schema.parse(body)
  const  {mqService, taskService } = getService(c)
  if(data.batch) {
    const task = await taskService.createBatchTask({input:data})
    await mqService.enqueue({type: msgType.BATCH_IMAGE_GEN, payload: task})
    return c.json(task)
  }
  const task = await taskService.createImageGenTask({input:{...data, style: data.style[0]}})
  await mqService.enqueue({type: msgType.IMAGE_GEN, payload: task})
  return c.json(task)
})



app.patch('/:taskid/retry', async (c) => {
  const taskId = c.req.param('taskid')
  const failOnly = Boolean(c.req.query('failOnly'))
  const  {mqService, taskService } = getService(c)
  let task = await taskService.getTaskById(taskId, false)
  if(!task) {
    throw new NotFoundError()
  }
  if(task.parentId) {
    task = (await taskService.getTaskById(task.parentId, false))!
  }
  if(task.status !== taskStatus.FAILED &&  task.status !== taskStatus.SUCCESS) {
    throw new ParameterError("task can't retry when status is pending or processing")
  }
  if(task.type === taskType.BATCH) {
    await mqService.enqueue({type: msgType.BATCH_TASK_RETRY, payload: { task, failOnly }})
  }else {
    await mqService.enqueue({type: msgType.TASK_RETRY, payload: task})
  }
  return c.json(task)
})

// todo change to websocket, realtime status
app.get('/:taskid/realtime', async (c) => {
  const taskId = c.req.param('taskid')
  const  {mqService, taskService } = getService(c)
  let task = await taskService.getTaskById(taskId, false)
  if(!task) {
    throw new NotFoundError()
  }
  if(task.parentId) {
    task = (await taskService.getTaskById(task.parentId, false))!
  }
  if(task.status !== taskStatus.PENDING &&  task.status !== taskStatus.PROCESSING) {
    throw new ParameterError("realtime task status only for pending or processing")
  }
  return c.json({})
})

app.get('/', async (c) => {
  const  { taskService, userService } = getService(c)
  const user =await userService.getCurrentUser()
  const tasks = await taskService.getTaskByUserId(user?.id ?? 'anonymous')
  return c.json(tasks)
})

app.get('/:taskid', async (c) => {
  const taskId = c.req.param('taskid')
  const  { taskService } = getService(c)
  const task = await taskService.getTaskById(taskId)
  if (!task) {
    throw new NotFoundError()
  }
  return c.json(task)
})

export { app as taskRoute }