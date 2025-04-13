'use client'
import { useTask } from "@/hooks/use-task"
import React from "react";
import { taskType } from "@repo/service/shared";

import {ImageGenTaskDetail} from "./image-gen-task-detail";
import BatchTaskImageDetail from "./batch-task-detail";

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