
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
