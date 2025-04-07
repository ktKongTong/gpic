'use client'
import {BatchImageTask, ImageTask, Task, useTask} from "@/hooks/use-task"
import { formatDate } from "@/lib/utils";
import Executions from "@/components/task/execution";
import React from "react";
import {StatusBadge, TypeBadge} from "@/components/task/badge";
import TaskItem from "@/app/task/task-item";
import {taskType, taskStatus} from "@repo/service/shared";

import { ProgressBar } from "./progressbar";
import { RetryButton} from "./retry-button";
import {AttemptMenu} from "@/app/task/[id]/attempt-menu";
import {ImageGenTaskDetail} from "@/app/task/[id]/image-gen-task-detail";
import BatchTaskImageDetail from "@/app/task/[id]/batch-task-detail";


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
    return <ImageGenTaskDetail task={task}/>
  }
  return <BatchTaskImageDetail task={task}/>
}


const getBatchTaskInput = ({task}: { task: BatchImageTask }) => {
  return <>
    {
      task.input.files.map((file, i) =>
        <div key={file} className={'relative h-32'}>
          <img src={file} key={file} className={'w-full h-32 rounded-lg object-cover'}/>
          <div className={'absolute right-0 bottom-0'}>
            {
              task.input.style.map(item => <>
                <div className={'rounded-full m-1 text-xs px-2 py-0.5  bg-black/40'} key={item}>
                  {item} x {task.input.times}
                </div>
              </>)
            }
          </div>
        </div>
      )
    }
  </>
}

const getBatchTaskProgress = ({task}: { task: BatchImageTask }) => {
  const state = task.metadata.state
  return <>
  {task.status === taskStatus.PROCESSING && <ProgressBar data={state}/>}
  </>
}

const getTaskInput = ({task}:{task: ImageTask}) => {
   return <>
    <div className={'flex items-center gap-2'}>
      {
        task.input.files.map((file, i) =>
        <div className={'relative h-32 w-32 rounded-lg'}>
          <img src={file} key={file} className={'w-32 h-32 rounded-lg object-cover'} />
          <div className={'rounded-full m-1 text-xs px-2 py-0.5  bg-black/40 absolute right-0 bottom-0'}>
            {task.input.style}
          </div>

        </div>
        )
      }
    </div>
  </>
}

const ImageGenOutput = ({task}:{task: ImageTask}) => {
  const execution = task.executions?.[0]
  switch (task.status) {
    case taskStatus.PENDING:
      return <div>排队中⌛️</div>
    case taskStatus.FAILED:
      return <>
        <div className={'text-red-500'}>执行失败</div>
        <div className={'text-red-500'}>{execution?.state.error}</div>
      </>
    case taskStatus.PROCESSING:
      return <div className={'text-blue-500'}>执行中...</div>
  }
  <img src={task.executions?.[0].output?.url} className={'max-h-32  rounded-lg'} />
}

const BatchImageTaskOutput = ({task}:{task: BatchImageTask}) => {
  const status = task.status
  switch (status) {
    case taskStatus.PENDING:
      return <div>正在等待中⌛️</div>
    case taskStatus.FAILED:
      return <div className={'text-red-500'}>执行失败</div>
    case taskStatus.PROCESSING:
      return <div className={'text-blue-500'}>执行中...</div>
  }
  return <>
  </>
}