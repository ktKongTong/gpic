export type ExecutionStatus = 'processing' | 'completed' | 'failed'
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type TaskType = 'image-gen' | 'batch'
export const taskStatus = {
  PENDING: 'pending' as const,
  PROCESSING: 'processing' as const,
  SUCCESS: 'completed' as const,
  FAILED: 'failed' as const
} as const
export const taskType = {
  IMAGE_GEN: 'image-gen' as const,
  BATCH: 'batch' as const
} as const

export const executionStatus = {
  PROCESSING: 'processing' as const,
  SUCCESS: 'completed' as const,
  FAILED: 'failed' as const
} as const

export const executionStatusArr = ['completed', 'failed', 'processing'] as const
export const taskStatusArr = ['pending','processing', 'completed', 'failed'] as const
export const taskTypeArr = ['image-gen', 'batch', ] as const



