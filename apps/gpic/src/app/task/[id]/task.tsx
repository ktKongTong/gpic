'use client'
import React, {useEffect, useState} from "react";
import { taskType } from "@repo/service/shared";

import {ImageGenTaskDetail} from "./image-gen-task-detail";
import BatchTaskImageDetail from "./batch-task-detail";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";


const WS_URL = process.env.NEXT_PUBLIC_WS_URL


export const useTask = (taskId: string) => {
  const [task, setTask] = useState<any | undefined>(undefined)
  const { isLoading } = useQuery({
    queryKey: ['task', 'task-item', taskId],
    queryFn: async () => {
      const res = await api.getTaskById(taskId)
      setTask(res)
    },
  })

  useEffect(() => {
    if(!task) return
    const id = task?.parentTaskId ?? task.id
    const ws = new WebSocket(`${WS_URL}/task/${id}/ws`)
    ws.onmessage = (e) => {
      console.log(e)
    }
    return () => {
      ws.close()
    }
  }, [task])

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
      <div className={'text-white/50'}>404 Not Found</div>
    </div>
  }
  if (task.type === taskType.IMAGE_GEN) {
    return <ImageGenTaskDetail task={task} />
  }
  // @ts-ignore
  return <BatchTaskImageDetail task={task}/>
}