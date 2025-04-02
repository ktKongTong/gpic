import {DrizzleD1Database} from "drizzle-orm/d1";
import * as schema from "./schema";
import {getDAO} from "./db";

export type DB = DrizzleD1Database<typeof schema>
export type DAO = ReturnType<typeof getDAO>

export type ExecutionStatus = 'processing' | 'success' | 'failed'
export type TaskStatus = 'waiting' | 'processing' | 'success' | 'failed'
export type TaskType = 'image-gen' | 'batch'
export const taskStatus = {
  WAITING: 'waiting' as const,
  PROCESSING: 'processing' as const,
  SUCCESS: 'success' as const,
  FAILED: 'failed' as const
} as const
export const taskType = {
  IMAGE_GEN: 'image-gen' as const,
  BATCH: 'batch' as const
} as const

export const executionStatus = {
  PROCESSING: 'processing' as const,
  SUCCESS: 'success' as const,
  FAILED: 'failed' as const
} as const

export type Task = typeof schema.task.$inferSelect
export type Execution = typeof schema.history.$inferSelect
// export type Execution = {
//   // processing, finished, failed
//   status: ExecutionStatus;
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   taskId: string;
//   usage: number;
//   // progress
//   state?: unknown;
//   // url: string
//   output?: unknown;
//   // prompt and styles
//   input: unknown;
// }

export type TaskUpdateDBO = {
  id: string,
  input?: any,
  type?: TaskType,
  retry?: number,
  status?: TaskStatus,
  metadata?: any,
}

export type ExecutionCreateDBO = {
  taskId: string,
  usage: number,
  state?: any,
  input: any,
  status: ExecutionStatus
}

export type ExecutionUpdateDBO = {
  id: string,
  output?: any,
  state?: any,
  status: ExecutionStatus
}