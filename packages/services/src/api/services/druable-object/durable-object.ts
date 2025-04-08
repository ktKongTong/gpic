
import {getDAO} from "../../storage/db";
import {FileService} from "../file";
import {UserService} from "../user-service";
import {MQService} from "../mq";
import {TaskService} from "../task";
import {HistoryService} from "../history";
import {AIImageService} from "../ai/image";
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

type TaskStatusUpdate = {
  updated: {
    status: TaskStatus,
  },
  old: {
    status: TaskStatus,
  }
  // 子任务状态更新 => 更新父任务
  // rerun
  task: Task
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

type AIStreamEvent = {
  timestamp: number,
  type: string,
  message: string,
}

type ImageGenTaskState = {
  status: TaskStatus,
  events: AIStreamEvent[],
  result?: string
}

// type Event = 'task-update' | 'task-complete' | 'execution-update'


export class BatchTaskStateDO extends DurableObject {
  taskType: TaskType = taskType.IMAGE_GEN
  private services: ReturnType<typeof createService>
  state : BatchTaskState | undefined
  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    super(ctx, env);
    this.services = createService(env)
    ctx.blockConcurrencyWhile(async () => {
      this.taskType = (await ctx.storage.get('task-type')) as TaskType || taskType.IMAGE_GEN
      this.state = (await ctx.storage.get('state'))
    })
  }

  // task type | task count
  async initialize() {

  }

  async broadcast(state: any) {
    this.ctx.getWebSockets().forEach(ws =>{
      if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(state))
    })
  }

  // async onCreateSubTask(count: number) {
  //   await this.ctx.blockConcurrencyWhile(async () => {
  //     let value = (await this.getState()) as BatchState;
  //     value = {
  //       ...value,
  //       total: value.total + count,
  //       pending: value.pending + count,
  //     }
  //     await this.broadcast(value)
  //   })
  // }

  async onBatchTaskUpdate(data:TaskStatusUpdate) {
    const state = await this.ctx.storage.get("state::batch") || defaultState
    this.ctx.waitUntil(this.broadcast(state))
  }

  // create -> log, sequence
  // async onImageGenTaskUpdate(data:TaskStatusUpdate) {
  //   await this.ctx.blockConcurrencyWhile(async () => {
  //     const state = await this.ctx.storage.get("state::image-gen") as ImageGenTaskState
  //     // let value = (await this.getState()) as BatchState;
  //   })
  // }

  // async onTaskUpdate(data:TaskStatusUpdate) {
  //   if(this.taskType ===taskType.IMAGE_GEN) {
  //     // return this.onImageGenTaskUpdate(data)
  //   }else {
  //     return this.onBatchTaskUpdate(data)
  //   }
  // }
  async onTaskEvent(data:Events) {
    if(this.taskType ===taskType.IMAGE_GEN) {
    }else {
      await this.ctx.blockConcurrencyWhile(async () => {
        // @ts-ignore
        this.state = handleTaskEvent(data, this.state)
        await this.ctx.storage.put('state', this.state)
        await this.broadcast(this.state)
      })
    }
  }
}


type ExecutionState = {
  status: ExecutionStatus,
  result?: string,
  error?: string,
  events: AIStreamEvent[]
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
  BATCH_CHILD_EXECUTION_FAIL: 'batch-child-execution-fail',
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
type BatchChildTaskExecutionFailEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_FAIL, payload: Execution }
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
  | BatchChildTaskExecutionFailEvent
  | BatchChildTaskExecutionCompletedEvent
  | BatchChildTaskFailEvent
  | BatchChildTaskCompletedEvent
  | BatchTaskFailedEvent
  | BatchTaskCompletedEvent

  const handleTaskEvent = (event: Events, state: BatchTaskState) => {
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
        res = { ...state, children: { ...state.children, [event.taskId]: event.payload } }; break
      case eventType.BATCH_CHILD_EXECUTION_PROCESSING:
        const currentChildTask = state.children[event.taskId]
        const metadata = state.metadata as BatchState
        metadata.processing++
        metadata.pending--
        res = {
          ...state,
          metadata,
          children: {
            ...state.children,
            [event.taskId]: { ...currentChildTask, execution: event.payload }
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
        };
        break
      case eventType.BATCH_CHILD_EXECUTION_FAIL:
        res = {
          ...state,
          children: {
            ...state.children,
            [event.taskId]: { ...state.children[event.taskId], execution: event.payload }
          }
        };
        break
      case eventType.BATCH_CHILD_EXECUTION_COMPLETE:
        res = { ...state,
          children: {
            ...state.children,
            [event.taskId]: { ...state.children[event.taskId], execution: event.payload }
          }
        };
        break
      case eventType.BATCH_CHILD_TASK_FAIL:
        const meta = state.metadata as BatchState
        meta.processing--
        meta.failed++
        res = {
          ...state,
          metadata: meta,
          children: {
            ...state.children,
            [event.taskId]: { ...state.children[event.taskId], ...event.payload }
          }
        };
        break
      case eventType.BATCH_CHILD_TASK_COMPLETE:
        const s = state.metadata as BatchState
        s.processing--
        s.completed++
        res = { ...state, metadata: s,
          children: {
            ...state.children,
            [event.taskId]: { ...state.children[event.taskId], ...event.payload }
          }
        };
        break
    }
    return res
  }