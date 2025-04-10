'use client'
import {useMutation, useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";
import {api} from "@/lib/api";
declare namespace ImageGenType {
  type Input = { files: string[], style?: string, prompt?: string }
  type Output = { url: string }
  type State = { progress: number, message: string, error?: string }
}

type TaskType = 'image-gen' | 'batch'
type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'
type ExecutionStatus =  | 'processing' | 'completed' | 'failed'
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

type MultiFile = {
  files: string[],
  style: string[],
}

export const useTasks = () => {
  const {data, isLoading} = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  })
  const tasks = (data ?? []) as (BatchImageTask | ImageTask)[]
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks.length > 0 ? tasks[0] : null);

  return {
    tasks,
    selectedTask,
    setSelectedTask,
  }
}


export const useTask = (taskId: string) => {
  const {data, isLoading} = useQuery({
    queryKey: ['task', 'task-item', taskId],
    queryFn: async () => {
      const res = await api.getTaskById(taskId)
      return res as BatchImageTask | ImageTask
    }
  })
  return {
    task: data,
    isLoading: false,
  }
}

type GenerateProps = MultiFile

export const useGenerateTasks = () => {
  const {mutate: generateMutation, data } = useMutation({
    mutationKey: ["generateTask"],
    mutationFn: async (props: GenerateProps) => {
      return await api.createTask(props)
    },
    onSuccess: async (data) => {
      toast.success('任务已创建', { description: (data as any)?.id })
    },
    onError: async (err) => {
      toast.error('任务创建失败', { description: err.message })
    }
  })
  return {
    generateTask: generateMutation,
  }
}

type StyleInput = {
  styleId: string,
} | {
  reference: string[],
  prompt: string
}

type TaskCreateV2 = {
  files: string[],
  styles: StyleInput[]
  count?: number,
  size?: 'auto' |'1x1'| '3x2' | '2x3',
  batch?: boolean
}

export const useGenerateTasksV2 = () => {
  const {mutate: generateMutation, data } = useMutation({
    mutationKey: ["generateTaskV2"],
    mutationFn: async (props: TaskCreateV2) => {
      return await api.createTaskV2(props)
    },
    onSuccess: async (data) => {
      toast.success('任务已创建', { description: (data as any)?.id })
    },
    onError: async (err) => {
      toast.error('任务创建失败', { description: err.message })
    }
  })
  return {
    generateTask: generateMutation,
  }
}