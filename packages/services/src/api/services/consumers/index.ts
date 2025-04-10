
import {
  msgType,
  Message,
} from "../mq";
import { setCloudflareEnv } from "../../utils";
import {Execution, executionStatus, Task, TaskStatus, taskStatus, taskType} from "../../storage/type";
import {z} from "zod";
import {getDO} from "../druable-object";
import {eventType} from "../druable-object/type";
import {createService} from "../factory";

const styleSchema = z.union([z.object({ styleId: z.string() }), z.object({
    prompt: z.string(),
    reference: z.string().array(),
})])

const schema = z.object({
  files: z.string().array().min(1),
  style: styleSchema,
  size: z.coerce.string().optional(),
})

export const v2matrixInputSchema = z.object({
  files: z.string().array().min(1).max(10, "Maximum 10 files"),
  styles: styleSchema.array().min(1).max(5, "Maximum 5 style"),
  count: z.coerce.number().min(1).max(100, "Maximum 100 count").optional().default(1),
  size: z.coerce.string().optional(),
  batch: z.coerce.boolean().optional().default(false),
}).refine((data) => {
  const total = data.styles.length * data.files.length * data.count
  return total <= 100
},{
  message: "total task count should be less than 100",
})
const matrixInputSchema = z.object({
  files: z.string().array().min(1).max(20),
  times: z.coerce.number().min(1).max(10).default(1).optional(),
  style: z.string().array().min(1).max(5),
})


const matrixToArray = (input: z.infer<typeof v2matrixInputSchema>) => {
  const res = []
  for (const file of input.files) {
    for (const style of input.styles) {
      for (let j = 0; j < (input.count ?? 1); j++) {
        res.push({files: [file], style, size: input.size})
      }
    }
  }
  return res
}

const batchInputSchema = z.object({
  files: z.string().array().min(1),
  style: z.string(),
})
type BatchMsg = {
  taskId: string,
  parentTaskId?: string,
  preStatus: TaskStatus,
  status: TaskStatus
}

export type BatchState = {
  pending: number,
  processing: number,
  failed: number,
  completed: number,
  total: number,
}
export class ConsumerService {
  services: ReturnType<typeof createService>
  constructor(private readonly env: CloudflareEnv) {
    setCloudflareEnv(env)
    this.services = createService(env);
  }

  async handleMsg(msg: Message) {
    if(msg.type === msgType.IMAGE_GEN) {
      await this.handleSingleImageGenTask(msg.payload)
    }else if (msg.type === msgType.BATCH_IMAGE_GEN) {
      await this.handleBatchImageGenTask(msg.payload)
    }else if (msg.type === msgType.BATCH_TASK_RETRY) {
      await this.handleBatchTaskRetry(msg.payload.task, msg.payload.failOnly)
    }else if (msg.type === msgType.TASK_RETRY) {
      await this.handleTaskRetry(msg.payload)
    }
  }

  async handleBatchTaskRetry(task: Task, failOnly: boolean) {
    const taskDO = getDO(task.id)
    const state = (task.metadata as any).state as BatchState
    state.pending = state.failed
    state.failed = 0
    const res = await this.services.taskService
    .updateTask({id: task.id, status: taskStatus.PROCESSING, metadata: { state }})
    await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_RETRY_FAILED, payload: res})
    const tasks = await this.services.taskService.getChildrenByTaskId(task.parentId!)
    const failedTasks = tasks.filter(it =>
      it.status === taskStatus.FAILED || (failOnly && it.status === taskStatus.SUCCESS)
    )
    const taskIds = failedTasks.map(it => it.id)
    const updated = await this.services.taskService.retryTasks(taskIds)
    await this.services.mqService.batch(updated.map(it => ({type: msgType.IMAGE_GEN, payload: it})))
  }

  async handleTaskRetry(task: Task) {
    const taskDO = getDO(task.parentId ?? task.id)
    const [updated] = await this.services.taskService.retryTasks([task.id])
    await taskDO.onTaskEvent({ taskId: task.id, event: eventType.RETRY_TASK_FAILED, payload: updated })
    await this.handleSingleImageGenTask(updated)
  }

  async handleBatchImageGenTask(task: Task) {
    const taskDO = getDO(task.id)
    await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_CREATE, payload: task })
    if(task.type !== taskType.BATCH) {
      const res = await this.services.taskService.updateTask({
        id: task.id,
        status: taskStatus.FAILED,
        metadata: { error: "wrong task handler; not a batch task" }})
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_FAILED, payload: res})
      return
    }
    try {
      const input = v2matrixInputSchema.parse(task.input)
      const inputs = matrixToArray(input)
      const state = {total: inputs.length, pending: inputs.length, processing: 0, completed: 0, failed: 0 }
      const newTask = await this.services.taskService
        .updateTask({id: task.id, status: taskStatus.PROCESSING, metadata: {state} })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_START, payload: newTask })
      const tasks = await this.services.taskService
        .createBatchImageGenTask({ parentId: task.id, userId: task.userId, inputs: inputs })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.TASK_CREATE, payload: tasks })
      await this.services.mqService.batch(tasks.map(it => ({type: msgType.IMAGE_GEN, payload: it})))
    }catch (e) {
      console.error(e)
      const res = await this.services.taskService.updateTask({ id: task.id, status: taskStatus.FAILED })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.BATCH_FAILED, payload: res })
    }
  }

  async handleSingleImageGenTask(task: Task) {
    const taskDO = getDO(task.parentId ?? task.id)
    const newTask = await this.services.taskService
      .updateTask({ id: task.id, status: taskStatus.PROCESSING })
    await taskDO.onTaskEvent({ taskId: task.id, event: eventType.TASK_PROCESSING, payload: newTask})
    const execution = await this.services.historyService
      .createExecutionHistory({ taskId: task.id, input: task.input, usage: 0, status: executionStatus.PROCESSING })
    await taskDO.onTaskEvent({ taskId: task.id, event:eventType.EXECUTION_PROCESSING, payload: execution })
    try {
      const res = await this.processAIMessage(task, execution)
      const updatedExecution = await this.services.historyService
        .updateExecutionHistory({ id: execution.id, ...res })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.EXECUTION_COMPLETE, payload: updatedExecution })
      const newStatus = res.status === 'completed' ? taskStatus.SUCCESS : taskStatus.FAILED
      const updatedTask = await this.services.taskService.updateTask({id: task.id, status: newStatus })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.TASK_COMPLETE, payload: updatedTask })
    }catch (e) {
      const updated = await this.services.historyService.updateExecutionHistory({
        id: execution.id,
        state: e,
        status: executionStatus.FAILED,
      })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.EXECUTION_COMPLETE, payload: updated })
      const updatedTask = await this.services.taskService.updateTask({ id: task.id, status: taskStatus.FAILED })
      await taskDO.onTaskEvent({ taskId: task.id, event: eventType.TASK_COMPLETE, payload: updatedTask})
    }
  }

  async processAIMessage(task: Task, execution: Execution) {
    let exec = execution
    const taskStateDO = getDO(task.parentId ?? task.id)
    const result = await this.services.aiService.generateImageV2(task.input as any)
    let ctx = { success: false, output: undefined as any, usage: 0, message: '', progress: '0' }
    for await (const event of result.fullStream) {
      switch (event.type) {
        case 'error':
          ctx.success = false;
          ctx.message += "aisdk stream error:"+ String(event.error)
          break
        case "finish":
          ctx.message += `aisdk finish-reason: ${event.finishReason}`
          break
        case 'text-delta':
          ctx.message += event.textDelta
          const res = await this.services.aiService.handleTextDelta(event.textDelta)
          switch (res.event) {
            case 'progress':
              ctx.progress = res.data
              exec.state = { progress: res.data }
              const updatedExec = await this.services.historyService.updateExecutionHistory({
                id: exec.id, state: { progress: res.data, message: ctx.message }, status: executionStatus.PROCESSING
              })
              await taskStateDO
                .onTaskEvent({ taskId: task.id, event: eventType.EXECUTION_UPDATE, payload: updatedExec })
              break
            case 'failed':
              ctx.success = false; break
            case 'success':
              ctx.progress = '100'
              ctx.output = { url: res.data }
              ctx.success=true; break
          }
      }
    }
    await taskStateDO.onTaskEvent({taskId: task.id, event: eventType.EXECUTION_UPDATE, payload: exec })
    if (ctx.success) {
      return {
        status: 'completed' as const,
        state: ctx,
        output: ctx.output,
      }
    }
    return {
      status: 'failed' as const,
      state: ctx,
      output: ctx.output ?? {
        error: `failed to get result, execution id: ${execution.id}`
      },
    }
  }

}