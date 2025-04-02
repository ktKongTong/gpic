import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {schema} from "../routes/ai";
import {NotFoundError} from "../errors/route";
import {msgType} from "../services";
import {mockTask} from "./mock";

const app = new Hono().basePath('/task')

app.post('/image/flavor-style', async (c) => {
  const body = await c.req.json()
  const data = schema.parse(body)
  const  {mqService, taskService } = getService(c)
  const task = await taskService.createTask({input:data})
  await mqService.enqueue({type: msgType.IMAGE_GEN, payload: task})
  return c.json(task)
})



app.put('/:taskid/retry', async (c) => {
  const taskId = c.req.param('taskid')
  const  {mqService, taskService } = getService(c)
  const task = await taskService.getTaskById(taskId)
  if(!task) {
    throw new NotFoundError()
  }
  const newTask = await taskService.updateTask({id: task.id, retry: task.retry + 1, status: 'waiting'})
  await mqService.enqueue({type: msgType.IMAGE_GEN, payload: newTask})
  return c.json(task)
})


app.get('/', async (c) => {
  return c.json(mockTask)
})

app.get('/:taskid', async (c) => {
  const taskId = c.req.param('taskid')
  const  { taskService } = getService(c)
  const task = await taskService.getTaskById(taskId)
  if (task) {
    throw new NotFoundError()
  }
  return c.json(task)
})

export { app as taskRoute }