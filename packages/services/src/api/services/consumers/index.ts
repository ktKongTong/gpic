import { getDAO } from "../../storage/db";
import { TaskService } from "../task";
import {AIImageService, FileService, HistoryService, MQService, msgType, UserService} from "../../services";
import {getCloudflareEnv, setCloudflareEnv} from "../../utils";
import {Execution, executionStatus, Task, TaskStatus, taskStatus, taskType} from "../../storage/type";
import {z} from "zod";

type Message<T> = {
  type: string;
  payload: T
};

const createService = (env: CloudflareEnv) => {
  const dao = getDAO(env)
  const fileService = new FileService();
  const userService = new UserService();
  const mqService = new MQService()
  const taskService = new TaskService(userService, mqService, dao);
  const historyService = new HistoryService(dao)
  const aiService = new AIImageService(fileService)
  return {
    aiService,
    mqService,
    taskService,
    userService,
    fileService,
    historyService
  }
}

const matrixInputSchema = z.object({
  files: z.string().array().min(1).max(20),
  times: z.coerce.number().min(1).max(10).default(1).optional(),
  style: z.string().array().min(1).max(5),
})

const matrixToArray = (input: z.infer<typeof matrixInputSchema>) => {
  const res = []
  for (const file of input.files) {
    for (const style of input.style) {
      for (let j = 0; j < (input.times ?? 1); j++) {
        res.push({files: [file], style})
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

  async handleMsg(msg: Message<Task>) {
    if(msg.type === msgType.IMAGE_GEN) {
      await this.handleSingleImageGenTask(msg.payload)
    }else if (msg.type === msgType.BATCH_IMAGE_GEN) {
      await this.handleBatchImageGenTask(msg.payload)
    }else if (msg.type === msgType.TASK_UPDATE) {
      await this.handleBatchTaskMsg(msg.payload as any)
    }
  }

  async handleBatchTaskMsg(msg: BatchMsg) {
    // todo: use durable object instead of queue to fix potential concurrency issue
    //
    if(!msg.parentTaskId) {
      return
    }
    const key = `task:batch:status:${msg.parentTaskId}`
    // @ts-ignore
    const _state = await getCloudflareEnv().KV.get<BatchState>(key, {
      type: 'json'
    })

    let state = _state!
    switch(msg.preStatus) {
      case taskStatus.PENDING: state.pending--;break
      case taskStatus.PROCESSING: state.processing--;break
      case taskStatus.SUCCESS: state.completed--;break
      case taskStatus.FAILED: state.failed--;break
    }
    switch(msg.status) {
      case taskStatus.PENDING: state.pending++;break
      case taskStatus.PROCESSING: state.processing++;break
      case taskStatus.SUCCESS: state.completed++;break
      case taskStatus.FAILED: state.failed++;break
    }
    // @ts-ignore
    await getCloudflareEnv().KV.put(key, JSON.stringify(state))
    let status:TaskStatus = taskStatus.PROCESSING
    if(state.pending === state.total) {
      status = taskStatus.PENDING
    } else if(state.processing === state.pending && state.processing === 0) {
      if(state.failed == state.total) {
        status = taskStatus.FAILED
      }
      status = taskStatus.SUCCESS
    }
    await this.services.taskService.updateTask({
      id: msg.parentTaskId,
      status: status,
      metadata: { state }
    }, taskStatus.PROCESSING)
  }
  async handleBatchImageGenTask(task: Task) {
    if(task.type !== taskType.BATCH) {
      await this.services.taskService.updateTask({ id: task.id, status: taskStatus.FAILED, metadata: {
        error: "wrong task handler; not a batch task"
      }}, task.status)
      return
    }
    let status = task.status
    try {
      const input = matrixInputSchema.parse(task.input)

      const inputs = matrixToArray(input)

      const state = {total: inputs.length, pending: inputs.length, processing: 0, completed: 0, failed: 0 }
      // @ts-ignore
      await getCloudflareEnv().KV.put(`task:batch:status:${task.id}`, JSON.stringify(state))
      await this.services.taskService.updateTask({ id: task.id, status: taskStatus.PROCESSING, metadata: {state} }, status)
      status = taskStatus.PROCESSING
      const tasks = await this.services.taskService.createBatchImageGenTask({
        parentId: task.id,
        userId: task.userId,
        inputs: inputs,
      })

      await this.services.mqService.batch(tasks.map(it => ({type: msgType.IMAGE_GEN, payload: it})))

    }catch (e) {
      console.error(e)
      await this.services.taskService.updateTask({ id: task.id, status: taskStatus.FAILED }, status)
    }
  }
  async handleSingleImageGenTask(task: Task) {
    const execution = await this.services.historyService
      .createExecutionHistory({
        taskId: task.id,
        input: task.input,
        usage: 0,
        status: executionStatus.PROCESSING
      })
    let status = task.status
    try {
      // const msg = {
      //   preStatus: task.status,
      //   parentTaskId: task.parentId,
      //   taskId: task.id,
      //   status: taskStatus.PROCESSING,
      // }
      await this.services.taskService.updateTask({ id: task.id, status: taskStatus.PROCESSING }, status)
      status = taskStatus.PROCESSING
      const res = await this.processAIMessage(task, execution)
      await this.services.historyService.updateExecutionHistory({ id: execution.id, ...res })
      const newStatus = res.status === 'completed' ? taskStatus.SUCCESS : taskStatus.FAILED
      await this.services.taskService.updateTask({id: task.id, status: newStatus }, status)
      status = newStatus
    }catch (e) {
      await this.services.historyService.updateExecutionHistory({
        id: execution.id,
        state: e,
        status: executionStatus.FAILED,
      })
      await this.services.taskService.updateTask({ id: task.id, status: taskStatus.FAILED }, status)
    }
  }

  async processAIMessage(task: Task, execution: Execution) {
    let exec = execution
    const result = await this.services.aiService.generateImage(task.input as any)
    let ctx = {
      success: false,
      output: undefined as any,
      usage: 0,
      message: '',
      progress: '0',
    }
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
              await this.services.historyService.updateExecutionHistory({
                id: exec.id,
                state: { progress: res.data, message: ctx.message },
                status: executionStatus.PROCESSING
              })
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