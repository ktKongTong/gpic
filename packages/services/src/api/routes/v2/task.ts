import {Hono} from "hono";
import {getService} from "../../middlewares/service-di";
import {msgType} from "../../services";
import {batchTaskInputSchema, taskStatus} from "../../shared";
import {BizError} from "../../errors";

const app = new Hono().basePath('/task')


app.post('/image/flavor-image', async (c) => {
  const body = await c.req.json()
  const data = batchTaskInputSchema.parse(body)
  const  {mqService, taskService,userService, userBalanceService} = getService(c)
  const {batch, ...rest} = data
  const totalTaskCount = data.files.length * data.count * data.styles.length
  const cost = totalTaskCount * 5
  const balance = await userBalanceService.getBalance()
  if (balance.balance < cost) {
    throw new BizError(`no enough balance, need: ${cost}, remain: ${balance.balance}`, 400)
  }
  let task: any
  if(batch) {
    task = await taskService.createBatchTask({ input:rest })
  }else {
    task = await taskService.createImageGenTask({
        input:{
          version: '1',
          files: data.files,
          size: data.size,
          style: data.styles[0]
        }
      }
    )
  }
  const order = await userBalanceService.createTaskOrder({
    taskId: task.id,
    cost
  })
  if(!order) {
    await taskService.updateTask({status: taskStatus.FAILED, id: task.id, metadata: {version: '1', error:'failed to decrease user balance' }})
    throw new BizError('failed to decrease user balance', 400)
  }
  const type = batch ? msgType.BATCH_IMAGE_GEN: msgType.IMAGE_GEN
  await mqService.enqueue({type, payload: task})
  return c.json(task)

})

export { app as taskV2Route }