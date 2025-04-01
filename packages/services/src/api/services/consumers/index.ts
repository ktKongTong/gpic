import { getDAO } from "../../storage/db";
import {Task, TaskService} from "../task";
import {AIImageService, FileService, HistoryService, UserService} from "../../services";
import {setCloudflareEnv} from "@/api/utils";

type Message<T> = {
  type: string;
  payload: T
};

type Execution = {
  // processing, finished, failed
  status: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  usage: number;
  // progress
  state?: unknown;
  // url: string
  output?: unknown;
  // prompt and styles
  input: unknown;
}
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
  // env ctx

  private async createCtx() {
  }

  async handleMsg(msg: Message<Task>) {
    if(msg.type === 'image-gen') {
      await this.handleSingleImageGenTask(msg.payload);
    }
  }
  async handleSingleImageGenTask(task: Task) {
    const execution = await this.services.historyService
      .createExecutionHistory({
        taskId: task.id,
        input: task.input,
        usage: 0,
        status: 'processing'
      })
    await this.services.taskService.updateTask({id: task.id, status: 'processing'})
    try {
      const res = await this.processAIMessage(task, execution)
      await this.services.historyService.updateExecutionHistory({
        id: execution.id,
        ...res,
      })
      const status = res.status === 'success' ? 'success' : 'failed'
      await this.services.taskService.updateTask({id: task.id, status: status })
    }catch (e) {
      await this.services.historyService.updateExecutionHistory({
        id: execution.id,
        output: e,
        status: 'failed',
      })
      await this.services.taskService.updateTask({id: task.id, status: 'failed'})
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
          console.error("something error", event.error)
          ctx.success = false;
          ctx.message += String(event.error)
          break
        case "finish":
          ctx.message += `finish, reason: ${event.finishReason}`
          // ctx.usage = event.usage
          break
        case 'text-delta':
          ctx.message += event.textDelta
          const res = await this.services.aiService.handleTextDelta(event.textDelta)
          switch (res.event) {
            // a frequent action
            case 'progress':
              ctx.progress = res.data
              exec.state = { progress: res.data }
              await this.services.historyService.updateExecutionHistory({id: exec.id, state: { progress: res.data, message: ctx.message }, status: 'processing'})
              break
            case 'unknown':
              ctx.message += res.data; break
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
        status: 'success',
        state: ctx,
        output: ctx.output,
      }
    }
    return {
      status: 'failed',
      state: ctx,
      output: ctx.output ?? {
        error: `failed to get result, execution id: ${execution.id}`
      },
    }
  }
}