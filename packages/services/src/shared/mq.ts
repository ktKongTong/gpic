import {Task} from "./task";

export const msgType = {
  IMAGE_GEN: 'image-gen' as const,
  BATCH_IMAGE_GEN: 'batch-image-gen' as const,
  BATCH_TASK_RETRY: 'batch-task-retry' as const,
  TASK_RETRY: 'task-retry' as const,
  TASK_COMPLETE: 'task-complete' as const,
}

type TaskCompleteMessage = {
  type: typeof msgType.TASK_COMPLETE,
  payload: Task,
  deduplicationId?: string
}

type ImageGenMessage = {
  type: typeof msgType.IMAGE_GEN | typeof msgType.BATCH_IMAGE_GEN,
  payload: Task,
  deduplicationId?: string
}

type RetryTaskMessage = {
  type: typeof msgType.TASK_RETRY,
  payload: Task,
  deduplicationId?: string
}
type BatchRetryTaskMessage = {
  type: typeof msgType.BATCH_TASK_RETRY,
  payload: {
    task: Task,
    failOnly: boolean
  },
  deduplicationId?: string
}

export type MQMessage = BatchRetryTaskMessage | RetryTaskMessage | ImageGenMessage | TaskCompleteMessage
