import {Hono} from "hono";
import {getService} from "../middlewares/service-di";

import {batchTaskInputSchema, taskStatus, msgType} from "../../shared";
import {BizError} from "../../errors";
import {authRequire} from "../middlewares/auth";

const app = new Hono().basePath('/task')

app.use(authRequire())

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
  const user = await userService.getCurrentUser()
  const userId = user!.id!
  let task: any
  if(batch) {
    task = await taskService.createBatchTask({ input:rest, userId})
  }else {
    task = await taskService.createImageGenTask({
        input:{
          version: '1',
          files: data.files,
          size: data.size,
          style: data.styles[0]
        }, userId
      }
    )
  }

  await userBalanceService.createTaskOrder({
    taskId: task.id,
    cost
  }).catch(async (e) => {
    await taskService.updateTask({status: taskStatus.FAILED, id: task.id,
      metadata: {
        version: '1',
        error:'failed to decrease user balance',
        rerun: false
      }
    })
    console.error(e)
    throw new BizError('failed to decrease user balance', 400)
  })

  const type = batch ? msgType.BATCH_IMAGE_GEN: msgType.IMAGE_GEN
  await mqService.enqueue({type, payload: task})
  return c.json(task)

})

export { app as taskV2Route }