import { getDAO } from "../../storage/db";
import { TaskService } from "../task";
import {AIImageService, FileService, HistoryService, msgType, UserService} from "../../services";
import {setCloudflareEnv} from "../../utils";
import {Execution, executionStatus, Task, taskStatus, taskType} from "../../storage/type";
import {NotImplementedError} from "../../errors/common";

type Message<T> = {
  type: string;
  payload: T
};

const createService = (env: CloudflareEnv) => {
  const dao = getDAO(env)
  const fileService = new FileService();
  const userService = new UserService();
  const taskService = new TaskService(userService, dao);
  const historyService = new HistoryService(dao)
  const aiService = new AIImageService(fileService)
  return {
    aiService,
    taskService,
    userService,
    fileService,
    historyService
  }
}


export class ConsumerService {
  services: ReturnType<typeof createService>
  constructor(private readonly env: CloudflareEnv) {
    setCloudflareEnv(env)
    this.services = createService(env);
  }

  private async createCtx() {

  }

  async handleMsg(msg: Message<Task>) {
    if(msg.type === msgType.IMAGE_GEN) {
      await this.handleSingleImageGenTask(msg.payload)
    }else if (msg.type === msgType.BATCH_IMAGE_GEN) {
      await this.handleBatchImageGenTask(msg.payload)
    }
  }
  async handleBatchImageGenTask(task: Task) {
    if(task.type !== taskType.BATCH) {
      throw new Error("not a batch task")
    }
    throw new NotImplementedError()
  }
  async handleSingleImageGenTask(task: Task) {
    const execution = await this.services.historyService
      .createExecutionHistory({
        taskId: task.id,
        input: task.input,
        usage: 0,
        status: executionStatus.PROCESSING
      })

    await this.services.taskService.updateTask({ id: task.id, status: taskStatus.PROCESSING })

    try {
      const res = await this.processAIMessage(task, execution)
      await this.services.historyService.updateExecutionHistory({ id: execution.id, ...res })
      const status = res.status === 'success' ? taskStatus.SUCCESS : taskStatus.FAILED
      await this.services.taskService.updateTask({id: task.id, status: status })
    }catch (e) {
      await this.services.historyService.updateExecutionHistory({
        id: execution.id,
        output: e,
        status: executionStatus.FAILED,
      })
      await this.services.taskService.updateTask({ id: task.id, status: taskStatus.FAILED })
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
        status: 'success' as const,
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