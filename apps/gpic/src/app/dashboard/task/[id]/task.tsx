'use client'
import React, {useEffect, useRef, useState} from "react";
import { taskType } from "@repo/service/shared";

import {ImageGenTaskDetail} from "./image-gen-task-detail";
import BatchTaskImageDetail from "./batch-task-detail";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";
import {Task} from "@/lib/type";
import {taskStatus} from "@repo/service/shared";


const WS_URL = process.env.NEXT_PUBLIC_WS_URL


export const useTask = (taskId: string) => {
  const [task, setTask] = useState<Task>();
  const { isLoading } = useQuery({
    queryKey: ['task', 'task-item', taskId],
    queryFn: async () => {
      const res = await api.getTaskById(taskId)
      setTask(res)
      return res
    },
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  })

  const wsRef = useRef<WebSocket>(null)
  useEffect(() => {
    if(!task || wsRef.current) return
    if(task.status !== taskStatus.PENDING && task.status !== taskStatus.PROCESSING) {
      return
    }
    console.log("refCurrent", wsRef.current)
    const isChild = !!task.parentTaskId
    const id = task?.parentTaskId ?? task.id
    const ws = new WebSocket(`${WS_URL}/api/v1/task/${id}/ws`)
    wsRef.current = ws
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      const {children, executions, ...rest} = data
      if(isChild) {
        const currentTask = (data as Task).children?.find(it => it.id === task.id)
        setTask(currentTask)
      } else {
        setTask(data)
      }
    }
    ws.onclose = (e) => {
      wsRef.current = null
    }
    ws.onerror = (e) => {
      ws.close()
      wsRef.current = null
    }
    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [task?.status])

  return {
    task,
    isLoading: isLoading,
  }
}

export default function TaskDetail({id}:{id: string}) {
  const {task, isLoading} = useTask(id)
  if (!task && isLoading) {
    return <div className={'flex items-center justify-center h-full'}>
      <div className={'text-white/50'}>Loading...</div>
    </div>
  }
  if (!task) {
    return <div className={'flex items-center justify-center h-full'}>
      <div className={'text-white/50'}></div>
    </div>
  }
  if (task.type === taskType.IMAGE_GEN) {
    // @ts-ignore
    return <ImageGenTaskDetail task={task} />
  }
  // @ts-ignore
  return <BatchTaskImageDetail task={task}/>
}