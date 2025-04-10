import {Execution, Task} from "../../storage/type";

export const eventType = {
  BATCH_CREATE: 'batch-create',
  BATCH_START: 'batch-start',
  BATCH_FAILED: 'batch-failed',
  BATCH_COMPLETE: 'batch-complete',

  TASK_CREATE: 'task-create',
  TASK_PROCESSING: 'task-processing',

  // child status change
  EXECUTION_PROCESSING: 'execution-processing',
  EXECUTION_UPDATE: 'execution-update',
  EXECUTION_COMPLETE: 'execution-complete',

  TASK_FAIL: 'task-fail',
  TASK_COMPLETE: 'task-complete',

  BATCH_RETRY_FAILED: 'batch-retry-failed',
  RETRY_TASK_FAILED: 'retry-failed',

} as const
type BatchTaskCreateEvent = { taskId: string, event: typeof eventType.BATCH_CREATE, payload: Task }
type BatchTaskStartEvent = { taskId: string, event: typeof eventType.BATCH_START, payload: Task }
type TaskCreateEvent = { taskId: string, event: typeof eventType.TASK_CREATE, payload: Task[] }

// item
type TaskProcessingEvent = { taskId: string, event: typeof eventType.TASK_PROCESSING, payload: Task }

// type TaskExecutionCreateEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_PROCESSING, payload: Execution }
type TaskExecutionProcessingEvent = { taskId: string, event: typeof eventType.EXECUTION_PROCESSING, payload: Execution }
type TaskExecutionUpdateEvent = { taskId: string, event: typeof eventType.EXECUTION_UPDATE, payload: Execution }
// type TaskExecutionFailEvent = { taskId: string, event: typeof eventType.BATCH_CHILD_EXECUTION_FAIL, payload: Execution }
type TaskExecutionCompletedEvent = { taskId: string, event: typeof eventType.EXECUTION_COMPLETE, payload: Execution }
type TaskFailEvent = { taskId: string, event: typeof eventType.TASK_FAIL, payload: Task }
type TaskCompletedEvent = { taskId: string, event: typeof eventType.TASK_COMPLETE, payload: Task }
type BatchTaskFailedEvent = { taskId: string, event: typeof eventType.BATCH_FAILED, payload: Task }
type BatchTaskCompletedEvent = { taskId: string, event: typeof eventType.BATCH_FAILED, payload: Task }

// retry task failed
type TaskRetryEvent =  { taskId: string, event: typeof eventType.RETRY_TASK_FAILED, payload: Task }

// retry task failed
type BatchTaskRetryEvent =  { taskId: string, event: typeof eventType.BATCH_RETRY_FAILED, payload: Task }

export type Events = BatchTaskCreateEvent
  | BatchTaskStartEvent
  | TaskCreateEvent
  | TaskProcessingEvent
  | TaskExecutionProcessingEvent
  | TaskExecutionUpdateEvent
  | TaskExecutionCompletedEvent
  | TaskFailEvent
  | TaskCompletedEvent
  | BatchTaskFailedEvent
  | BatchTaskCompletedEvent
  | TaskRetryEvent
  | BatchTaskRetryEvent
