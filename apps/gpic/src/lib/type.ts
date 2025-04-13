import {ExecutionStatus, TaskType, TaskStatus, StyleInfo} from "@repo/service/shared";

export type Execution<I extends any = any,O extends any = any,S extends any = any> = {
  id: string,
  taskId: string,
  name: string,
  status: ExecutionStatus,
  input: I,
  output?: O,
  state: S,
  startedAt?: string,
  endedAt?: string,
  createdAt: string,
  updatedAt: string,
}

export type Task<
  T extends TaskType = TaskType,
  E extends Execution = Execution,
  M extends any = any,
  I = E extends Execution<infer EI> ? EI: never,
> = {
  id: string,
  name: string,
  userId: string,
  parentTaskId?: string
  type: T,
  status: TaskStatus,
  retry: number,
  usage:  number,
  input: I,
  metadata: M,
  startedAt?: string,
  endedAt?: string,
  createdAt: string,
  updatedAt: string,
  executions: E[],
  children?: ImageTask[]
}

type Style = {
  styleId: string,
} | {
  prompt: string,
  reference: string[]
}

declare namespace BatchType {
  type Input = { files: string[], style: Style[], count: number }
  type Output = { url: string }
  type State = any
  type Metadata = {state: { total: number, completed: number, failed: number, processing: number, pending: number }}
}
declare namespace ImageGenType {
  type Input = { files: string[], style?: StyleInfo, prompt?: string }
  type Output = { url: string }
  type State = { progress: number, message: string, error?: string }
}
export type ImageExecution = Execution<ImageGenType.Input, ImageGenType.Output, ImageGenType.State>
export type BatchExecution = Execution<BatchType.Input, BatchType.Output, BatchType.State>
export type ImageTask = Task<'image-gen',ImageExecution>
export type BatchImageTask = Task<'batch', BatchExecution, BatchType.Metadata> & {
  children?: ImageTask[]
}