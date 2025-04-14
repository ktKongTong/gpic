import {ExecutionStatus, TaskStatus, TaskType} from "./common";
export type Task = {
  id: string,
  parentId: string | null,
  name: string,
  userId: string,
  input: any,
  metadata: any,
  type: TaskType
  retry: number,
  status: TaskStatus,
  startedAt: Date | null,
  endedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}

export type Execution = {
  id: string,
  name: string,
  taskId: string,
  usage: number,
  input: any,
  output: any,
  state: any,
  status: ExecutionStatus,
  startedAt: Date | null,
  endedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
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