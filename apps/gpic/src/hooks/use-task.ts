'use client'
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {ExecutionStatus, TaskStatus, TaskType } from "@repo/service/shared";
import {StyleInfo} from "@repo/service/shared";
import {queryKeys} from "@/lib/query";

declare namespace ImageGenType {
  type Input = { files: string[], style?: StyleInfo, prompt?: string }
  type Output = { url: string }
  type State = { progress: number, message: string, error?: string }
}

export type Execution<I extends any = any,O extends any = any,S extends any = any> = {
  id: string,
  taskId: string,
  name: string,
  status: ExecutionStatus,
  input: I,
  output?: O,
  state: S,
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
  createdAt: string,
  updatedAt: string,
  executions: E[]
}

declare namespace BatchType {
  type Input = { files: string[], style: string[], times: number }
  type Output = { url: string }
  type State = any
  type Metadata = {state: { total: number, completed: number, failed: number, processing: number, pending: number }}
}

export type ImageExecution = Execution<ImageGenType.Input, ImageGenType.Output, ImageGenType.State>
export type BatchExecution = Execution<BatchType.Input, BatchType.Output, BatchType.State>
export type ImageTask = Task<'image-gen',ImageExecution>
export type BatchImageTask = Task<'batch', BatchExecution, BatchType.Metadata> & {
  children?: ImageTask[]
}

export const useTasks = () => {
  const {data, isLoading} = useQuery({ queryKey: queryKeys.tasks, queryFn: () => api.getTasks() })
  const tasks = (data ?? []) as (BatchImageTask | ImageTask)[]

  return {
    tasks,
  }
}