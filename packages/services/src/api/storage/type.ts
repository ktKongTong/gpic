import {DrizzleD1Database} from "drizzle-orm/d1";
import * as schema from "./schema";
import {getDAO} from "./db";

export type DB = DrizzleD1Database<typeof schema>
export type DAO = ReturnType<typeof getDAO>

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

export type Task = typeof schema.task.$inferSelect
export type Execution = typeof schema.history.$inferSelect

export type TaskUpdateDBO = {
  id: string,
  input?: any,
  type?: TaskType,
  retry?: number,
  status: TaskStatus,
  startedAt?: Date,
  endedAt?: Date,
  metadata?: any,
}

export type ExecutionCreateDBO = {
  taskId: string,
  usage: number,
  state?: any,
  input: any,
  startedAt: Date,
  status: ExecutionStatus
}

export type ExecutionUpdateDBO = {
  id: string,
  output?: any,
  state?: any,
  endedAt?: Date,
  status: ExecutionStatus,

}