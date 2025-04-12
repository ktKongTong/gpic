import type {DrizzleD1Database} from "drizzle-orm/d1";
import * as schema from "./schema";
import {getDAO} from "./db";
import {ExecutionStatus, TaskStatus, TaskType} from "../shared";

export type DB = DrizzleD1Database<typeof schema>
export type DAO = ReturnType<typeof getDAO>

export type Task = typeof schema.task.$inferSelect
export type Execution = typeof schema.execution.$inferSelect

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
  usage?: number,
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