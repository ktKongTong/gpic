import {createService} from "../factory";
import {setCloudflareEnv} from "../../utils";
import {z} from "zod";
import {
  eventType,
  msgType,
  BatchState,
  batchTaskInputSchema,
  taskStatus,
  taskType,
  Task,
  EventType
} from "../../shared";
import { getDO } from "../../durable-object";


const matrixToArray = (input: z.infer<typeof batchTaskInputSchema>) => {
  const res = []
  for (const file of input.files) {
    for (const style of input.styles) {
      for (let j = 0; j < (input.count ?? 1); j++) {
        res.push({files: [file], style, size: input.size, version: '1'})
      }
    }
  }
  return res
}


export class BatchHandlerV1 {

  services: ReturnType<typeof createService>
  constructor(private readonly env: CloudflareEnv) {
    setCloudflareEnv(env)
    this.services = createService(env);
  }


  async handleBatchTaskRetry(task: Task, failOnly: boolean) {
    const taskDO = getDO(task.id)
    const state = (task.metadata as any).state as BatchState
    state.pending = state.failed
    state.failed = 0
    const res = await this.services.taskService
      .updateTask({id: task.id, status: taskStatus.PROCESSING, startedAt: new Date(), metadata: { ...task.metadata, state }})
    await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_RETRY_FAILED, payload: res})
    const tasks = await this.services.taskService.getChildrenByTaskId(task.parentId!)
    const failedTasks = tasks.filter(it =>
      it.status === taskStatus.FAILED || (failOnly && it.status === taskStatus.SUCCESS)
    )
    const taskIds = failedTasks.map(it => it.id)
    if(taskIds.length > 0) {
      const updated = await this.services.taskService.retryTasks(taskIds)
      await this.services.mqService.batch(updated.map(it => ({type: msgType.IMAGE_GEN, payload: it})))
    }else {
      const res = await this.services.taskService
        .updateTask({id: task.id, status: taskStatus.SUCCESS, startedAt: new Date(), metadata: { ...task.metadata, state }})
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_COMPLETE, payload: res })
    }
  }

  async handleBatchImageGenTask(task: Task) {
    const taskDO = getDO(task.id)
    const notifyDO = async (event: EventType, payload: any) => {
      await taskDO.onTaskEvent({ taskId: task.id, event: event, payload: payload })
    }
    await notifyDO(eventType.BATCH_CREATE, task)
    let state = {total: 0, pending: 0, processing: 0, completed: 0, failed: 0 }
    if(task.type !== taskType.BATCH) {
      const updated = await this.services.taskService.updateTask({
        id: task.id,
        status: taskStatus.FAILED,
        metadata: {  version: '1', error: "wrong task handler; not a batch task" }})
      await notifyDO(eventType.BATCH_FAILED, updated)
      return
    }

    try {

      const input = batchTaskInputSchema.parse(task.input)
      const inputs = matrixToArray(input)
      state.total = inputs.length
      state.pending = inputs.length
      const updatedTask = await this.services.taskService.updateTask({id: task.id, startedAt: new Date(), status: taskStatus.PROCESSING, metadata: {version: '1', state}})
      await notifyDO(eventType.BATCH_START, updatedTask)

      const tasks = await this.services.taskService.createBatchImageGenTask({ parentId: task.id, userId: task.userId, inputs: inputs })
      await notifyDO(eventType.TASK_CREATE, tasks)

      await this.services.mqService.batch(tasks.map(it => ({type: msgType.IMAGE_GEN, payload: it})))

    }catch (e) {
      console.error(e)
      const res = await this.services.taskService.updateTask({
        id: task.id,
        endedAt: new Date(),
        status: taskStatus.FAILED
      })
      await notifyDO(eventType.BATCH_FAILED, res)
    }
  }



}