import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {NotFoundError, ParameterError, UnauthorizedError} from "../../errors";
import {taskStatus, taskType, msgType} from "../../shared";
import {getCloudflareEnv} from "../../utils";

const app = new Hono().basePath('/task')

app.get('/', async (c) => {
  const  { taskService, userService } = getService(c)
  const user = await userService.getCurrentUser()
  if(!user) {
    throw new UnauthorizedError()
  }
  const tasks = await taskService.getTaskByUserId(user.id)
  return c.json(tasks)
})

app.patch('/:taskid/retry', async (c) => {
  const taskId = c.req.param('taskid')
  const failOnly = !Boolean(c.req.query('all'))
  const  {mqService, taskService, userService } = getService(c)
  const user = await userService.getCurrentUser()
  const uid = user!.id
  let task = await taskService.getTaskByIdAndUserId(taskId, uid, false)
  if(!task) {
    throw new NotFoundError()
  }
  if(task.parentId) {
    task = (await taskService.getTaskById(task.parentId, false))!
  }
  if(task.status !== taskStatus.FAILED &&  task.status !== taskStatus.SUCCESS) {
    throw new ParameterError("task can't retry when status is pending or processing")
  }

  if(task.metadata?.rerun === false) {
    throw new ParameterError("this task can't rerun")
  }

  if(task.type === taskType.BATCH) {
    await mqService.enqueue({type: msgType.BATCH_TASK_RETRY, payload: { task, failOnly }})
  }else {
    await mqService.enqueue({type: msgType.TASK_RETRY, payload: task})
  }
  return c.json(task)
})

// not work for opennext now, always throw error: the script will never generate a response.
app.get('/:taskid/ws', async (c) => {
  const taskId = c.req.param('taskid')
  if (c.req.header("upgrade") !== "websocket") {
    return c.text("Expected Upgrade: websocket", 426);
  }
  const  { taskService, userService} = getService(c)
  const user = await userService.getCurrentUser()
  const uid = user!.id
  let task = await taskService.getTaskByIdAndUserId(taskId, uid, false)

  if(!task) {
    throw new NotFoundError()
  }

  if(task.parentId) {
    task = (await taskService.getTaskById(task.parentId, false))!
  }
  if(task.status !== taskStatus.PENDING &&  task.status !== taskStatus.PROCESSING) {
    throw new ParameterError("task status should be pending or processing")
  }
  const id = getCloudflareEnv().DO_TASK_STATUS.idFromName(taskId)
  const stub = getCloudflareEnv().DO_TASK_STATUS.get(id)
  //@see https://discord.com/channels/595317990191398933/773219443911819284/1300064731259736177
  // pass c.req.raw directly will cause TypeError: Invalid URL: [object Request]
  // (work well in plain worker but get error in opennext)
  const res =await stub.fetch(c.req.raw.url, {
    ...c.req.raw,
    headers: c.req.raw.headers
  })
  return  res
})


app.get('/:taskid', async (c) => {
  const taskId = c.req.param('taskid')
  const  { taskService, userService} = getService(c)
  const user = await userService.getCurrentUser()
  const uid = user?.id!
  let task = await taskService.getTaskByIdAndUserId(taskId, uid)
  if(!task) {
    throw new NotFoundError()
  }
  return c.json(task)
})

export { app as taskRoute }