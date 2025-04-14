import {createService} from "../factory";
import {setCloudflareEnv} from "../../utils";
import {EventType, eventType, executionStatus, Task, taskStatus} from "../../shared";
import {getDO} from "../../durable-object";


export class ImageTaskHandlerV1 {

  services: ReturnType<typeof createService>
  constructor(private readonly env: CloudflareEnv) {
    setCloudflareEnv(env)
    this.services = createService(env);
  }
  async handleTaskRetry(task: Task) {
    const [updated] = await this.services.taskService.retryTasks([task.id])
    await this.handleSingleImageGenTask(updated)
  }

  async handleSingleImageGenTask(task: Task) {
    // task DurableObject RPC Stub
    const taskDO = getDO(task.parentId ?? task.id)
    // notify (parent, if exist) task durable object
    const notifyDO = async (event: EventType, payload: any) => {
      try {
        await taskDO.onTaskEvent({ taskId: task.id, event: event, payload: payload }) 
      }catch (e: any) {
        console.error(e)
        if(e?.retryable) {
          console.error("retrying", e)
          await notifyDO(event, payload)
        }
      }
    }

    const processingTask = await this.services.taskService.updateTask({ id: task.id, startedAt: new Date(), status: taskStatus.PROCESSING })
    await notifyDO(eventType.TASK_PROCESSING, processingTask)

    const execution = await this.services.historyService.startExecution({ taskId: task.id, input: task.input })
    console.log("execution start")
    await notifyDO(eventType.EXECUTION_PROCESSING, execution)
    console.log("execution start over")
    let res: StatusRes
    try {
      const onProgress = async (progress: ProgressCtx) => {
        console.log('onprogress', progress)
        const updatedExec = await this.services.historyService
          .updateExecutionHistory({id: execution.id, state: progress, status: executionStatus.PROCESSING})
        await notifyDO(eventType.EXECUTION_UPDATE, updatedExec)
      }
      res = await this.generate(task, onProgress)
    }catch (e) {
      res = { state: {version: '1', error: e, message: e?.toString()}, status: executionStatus.FAILED }
    }
    const updatedExecution = await this.services.historyService.updateExecutionHistory({ id: execution.id, ...res, endedAt: new Date() })
    await notifyDO(eventType.EXECUTION_COMPLETE, updatedExecution)

    const updatedTask = await this.services.taskService.updateTask({id: task.id, endedAt: new Date(), status: res.status})
    await notifyDO(eventType.TASK_COMPLETE, updatedTask)
  }

  async generate(task: Task, onProgress:(ctx: ProgressCtx)=>Promise<void>){
    console.log("generating")
    const result = await this.services.aiService.generateImageV2(task.input as any)
    let ctx = { version: '1', success: false, output: undefined as any, usage: 0, message: '', progress: '0' }
    console.log("processing generating result")
    for await (const event of result.fullStream) {
      console.log('ai-event', event.type)
      switch (event.type) {
        case 'error':
          ctx.success = false;
          ctx.message += "\n\naisdk stream error:"+ String(event.error)
          break
        case "finish":
          ctx.message += `\n\naisdk finish-reason: ${event.finishReason}`
          break
        case 'text-delta':
          console.log('ai-text-delta', event.textDelta)
          ctx.message += event.textDelta
          const res = await this.services.aiService.handleTextDelta(event.textDelta)
          switch (res.event) {
            case 'progress':
              ctx.progress = res.data
              await onProgress(ctx)
              break
            case 'unknown':
              await onProgress(ctx)
              break
            case 'failed':
              ctx.success = false; break
            case 'success':
              ctx.progress = '100'
              ctx.output = {version: '1', url: res.data }
              ctx.success=true;
              break
          }
      }
    }
    return  {
      status: ctx.success? executionStatus.SUCCESS : executionStatus.FAILED,
      state: ctx,
      output: ctx.output,
    }
  }
}

type ProgressCtx = {
  version: string,
  output?: any,
  usage?: any,
  message: string,
  progress: string
}

type StatusRes = {
  output?: any,
  status: any,
  state?: any
}