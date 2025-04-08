
import {getDAO} from "../../storage/db";
import {FileService} from "../file";
import {UserService} from "../user-service";
import {MQService} from "../mq";
import {TaskService} from "../task";
import {HistoryService} from "../history";
import {AIImageService} from "../ai/image";
// @ts-ignore
import {DurableObject} from "cloudflare:workers";
import {
  Execution,
  ExecutionStatus,
  Task,
  taskStatus,
  TaskStatus,
  TaskType,
  taskType,
  TaskUpdateDBO
} from "../../storage/type";

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

type BatchState = {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}
const defaultState = {
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0,
  failed: 0
}

//@ts-ignore
export class BatchTaskStateDO extends DurableObject {
  taskType: TaskType | undefined
  private services: ReturnType<typeof createService>
  state : BatchTaskState | undefined
  initialized = false
  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    super(ctx, env);
    this.services = createService(env)
    ctx.blockConcurrencyWhile(async () => {
      this.taskType = (await ctx.storage.get('task-type')) as TaskType
      this.initialized = (await ctx.storage.get('initialized')) as boolean
      await this.getState()
    })
  }

  // https://developers.cloudflare.com/durable-objects/observability/troubleshooting/#durable-object-reset-because-its-code-was-updated
  async setState(state: BatchTaskState) {
    try {
      this.state = state
      await this.ctx.storage.put('state', state)
    } catch (e) {
      await this.setState(state)
    }
  }

  async getState(): Promise<BatchTaskState> {
    try {
      if(this.state) return this.state
      this.state = (await this.ctx.storage.get('state')) as BatchTaskState
      return this.state
    }catch (e) {
      return await this.getState()
    }
  }

  async initialize(task: Task): Promise<boolean> {
    return this.ctx.blockConcurrencyWhile(async () => {
      try {
        if (this.initialized) return true
        this.initialized = true
        this.taskType = task.type
        await this.ctx.storage.put('task-type', task.type)
        await this.ctx.storage.put('initialized', true)
        return true
      }catch (e) {
        return await this.initialize(task)
      }
    })
  }

  async broadcast(state: any) {
    this.ctx.getWebSockets().forEach(ws =>{
      if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(state))
    })
  }

  async getTaskType(): Promise<TaskType> {
    try {
      if(this.taskType) return this.taskType
      this.taskType = (await this.ctx.storage.get('task-type')) as TaskType
      return this.taskType
    }catch (e) {
      return await this.getTaskType()
    }
  }

  async onTaskEvent(data:Events) {
    await this.ctx.blockConcurrencyWhile(async () => {
      if(data.event === eventType.BATCH_CREATE || data.event === eventType.BATCH_CHILD_TASK_PROCESSING) {
        await this.initialize(data.payload)
      }
      const type = await this.getTaskType()
      if(type === taskType.BATCH) {
        // @ts-ignore
        const newState = handleBatchTaskEvent(data, this.getState())
        await this.setState(newState)
        await this.services.taskService.updateTask({id: newState.id, metadata: newState.metadata, status: newState.status })
        await this.broadcast(newState)
      }else {
        // @ts-ignore
        const newState = handleTaskEvent(data, this.getState())
        // @ts-ignore
        await this.setState(newState)
        await this.services.taskService.updateTask({id: newState.id, metadata: newState.metadata, status: newState.status })
        await this.broadcast(newState)
      }
    })
  }

}




type BatchTaskState = Task & {
  children: Record<string, ImageTaskState>
}

type ImageTaskState = Task & {
  execution?: Execution
}

export const eventType = {
  BATCH_CREATE: 'batch-task-create',
  BATCH_START: 'batch-task-start',
  // // child status count
  // BATCH_CHILD_TASK_QUEUEING: 'batch-child-task-queueing',
  // child status change
  BATCH_CHILD_TASK_CREATE: 'batch-child-task-create',
  BATCH_CHILD_TASK_PROCESSING: 'batch-child-task-processing',
  // BATCH_CHILD_EXECUTION_CREATE: 'batch-child-execution-create',
  BATCH_CHILD_EXECUTION_PROCESSING: 'batch-child-execution-processing',
  BATCH_CHILD_EXECUTION_UPDATE: 'batch-child-execution-update',
  // BATCH_CHILD_EXECUTION_FAIL: 'batch-child-execution-fail',
  BATCH_CHILD_EXECUTION_COMPLETE: 'batch-child-execution-complete',
  // child status change
  BATCH_CHILD_TASK_FAIL: 'batch-child-task-fail',
  BATCH_CHILD_TASK_COMPLETE: 'batch-child-task-complete',
  BATCH_TASK_FAILED: 'batch-task-failed',
  BATCH_TASK_COMPLETE: 'batch-task-complete',
} as const

type BatchTaskCreateEvent = { taskId: string, event: typeof eventType.BATCH_CREATE, payload: Task }
type BatchTaskStartEvent = { taskId: string, event: typeof eventType.BATCH_START, payload: Task }
type BatchChildTaskCreateEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_TASK_CREATE, payload: Task[] }

// item
type BatchChildTaskProcessingEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_TASK_PROCESSING, payload: Task }

// type BatchChildTaskExecutionCreateEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_PROCESSING, payload: Execution }
// Execution 从 Processing 开始
type BatchChildTaskExecutionProcessingEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_PROCESSING, payload: Execution }
type BatchChildTaskExecutionUpdateEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_UPDATE, payload: Execution }
// type BatchChildTaskExecutionFailEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_FAIL, payload: Execution }
type BatchChildTaskExecutionCompletedEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_COMPLETE, payload: Execution }
type BatchChildTaskFailEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_TASK_FAIL, payload: Task }
type BatchChildTaskCompletedEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_TASK_COMPLETE, payload: Task }
// 此事件Batch Failed和Completed 一般不会显式触发，而是每个在Failed/Completed时触发
// 这个事件只在最初开始错误的时候会触发
type BatchTaskFailedEvent = { taskId: string, event: typeof eventType.BATCH_TASK_FAILED, payload: Task }
type BatchTaskCompletedEvent = { taskId: string, event: typeof eventType.BATCH_TASK_FAILED, payload: Task }

type Events = BatchTaskCreateEvent
  | BatchTaskStartEvent
  | BatchChildTaskCreateEvent
  | BatchChildTaskProcessingEvent
  | BatchChildTaskExecutionProcessingEvent
  | BatchChildTaskExecutionUpdateEvent
  // | BatchChildTaskExecutionFailEvent
  | BatchChildTaskExecutionCompletedEvent
  | BatchChildTaskFailEvent
  | BatchChildTaskCompletedEvent
  | BatchTaskFailedEvent
  | BatchTaskCompletedEvent


type TaskState = {
  execution: Execution,
} & Task

const handleTaskEvent = (event: Events, state: TaskState) => {
  let res = state
  switch (event.event) {
    case eventType.BATCH_CREATE:
    case eventType.BATCH_TASK_FAILED:
    case eventType.BATCH_START:
    case eventType.BATCH_CHILD_TASK_CREATE: break
    case eventType.BATCH_CHILD_TASK_PROCESSING:
      res = { ...state, ...event.payload }
      break
    case eventType.BATCH_CHILD_EXECUTION_PROCESSING:
    case eventType.BATCH_CHILD_EXECUTION_UPDATE:
    case eventType.BATCH_CHILD_EXECUTION_COMPLETE:
      res = { ...state, execution: event.payload};
      break
    case eventType.BATCH_CHILD_TASK_FAIL:
    case eventType.BATCH_CHILD_TASK_COMPLETE:
      res = { ...state, ...event.payload }
      break
  }
  return res
}

  const handleBatchTaskEvent = (event: Events, state: BatchTaskState) => {
    let res = state
    switch (event.event) {
      case eventType.BATCH_CREATE:
      case eventType.BATCH_TASK_FAILED:
      case eventType.BATCH_START:
        res =  state ? { ...state, ...event.payload }: {...event.payload, children: {}}; break
      case eventType.BATCH_CHILD_TASK_CREATE:
        const children:Record<string, ImageTaskState> = {}
        event.payload.reduce((acc, it) => {
          acc[it.id] = { ...it, execution: undefined}
          return acc }, {} as Record<string, ImageTaskState>)
        res = { ...state, children }; break
      case eventType.BATCH_CHILD_TASK_PROCESSING:
        const metadata = state.metadata as any
        let curs = metadata.state ?? defaultState as BatchState
        curs.processing++
        curs.pending--
        res = { ...state,
          metadata: {
          ...metadata, state: curs
          },
          children: { ...state.children, [event.taskId]: event.payload } }; break
      case eventType.BATCH_CHILD_EXECUTION_PROCESSING:
        res = { ...state,
          children: { ...state.children,
            [event.taskId]: { ...state.children[event.taskId], execution: event.payload }
        }
        };
        break
      case eventType.BATCH_CHILD_EXECUTION_UPDATE:
        const current = state.children[event.taskId]
        res = {
          ...state,
          children: {
            ...state.children,
            [event.taskId]: { ...current, execution: event.payload }
          }
        }; break
      case eventType.BATCH_CHILD_EXECUTION_COMPLETE:
        res = { ...state, children: {
          ...state.children,
          [event.taskId]: { ...state.children[event.taskId], execution: event.payload }
        }}; break
      case eventType.BATCH_CHILD_TASK_FAIL:
        const m1 = state.metadata as any
        let bs1 = (m1.state ?? defaultState) as BatchState
        bs1.processing--
        bs1.failed++
        let batchstatus = state.status
        if(bs1.processing === 0 && bs1.pending === 0) {
          batchstatus = taskStatus.SUCCESS
        }
        res = {
          ...state,
          status: batchstatus,
          metadata: { ...m1, state: bs1 },
          children: {
            ...state.children,
            [event.taskId]: { ...state.children[event.taskId], ...event.payload }
          }
        };
        break
      case eventType.BATCH_CHILD_TASK_COMPLETE:
        const m = state.metadata as any
        let bs = (m.state ?? defaultState) as BatchState
        bs.processing--
        bs.completed++
        let status = state.status
        if(bs.processing === 0 && bs.pending === 0) {
          status = taskStatus.SUCCESS
        }
        res = { ...state, metadata: { ...m, state: bs },
          status,
          children: {
            ...state.children,
            [event.taskId]: { ...state.children[event.taskId], ...event.payload }
          }
        };
        break
    }
    return res
  }