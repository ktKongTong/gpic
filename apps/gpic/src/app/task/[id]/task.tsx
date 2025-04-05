'use client'
import {BatchImageTask, ImageTask, Task, useTask} from "@/hooks/use-task"
import TaskDetails from "@/components/task/detail";
import {cn, formatDate} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {RotateCcw} from "lucide-react";
import Executions from "@/components/task/execution";
import React from "react";
import {StatusBadge, TypeBadge} from "@/components/task/badge";
import TaskItem from "@/app/task/task-item";
import {taskStatus} from "@repo/service/shared";
import {taskType} from "@repo/service/shared";
import { ProgressBar } from "./progressbar";

export default function TaskDetail({id}:{id: string}) {
  const task = useTask(id)
  if (!task) {
    return <div className={'flex items-center justify-center h-full'}>
      <div className={'text-white/50'}>Loading...</div>
    </div>
  }

  return <>
    <div className={'sm:flex items-center justify-between w-full h-full grid'}>
      <div>
        <h3 className={'text-3xl font-bold'}>{task.name}</h3>
        <div className={'text-xs'}>
          <span className="text-white/50">创建于: </span>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>
      <div className={'flex gap-2 items-center'}>
        <StatusBadge status={task.status} />
        <TypeBadge type={task.type} />
        { (task.status === 'failed' || task.status === 'completed') && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-white/20 bg-transparent hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
    <div className="p-4 h-full w-full">
      <div className="flex flex-col w-full">
        {/* Input summary */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="grid">
            <div>
              {task.type === taskType.BATCH && getBatchTaskProgress({task})}
              <div className={'flex items-center gap-2 m-2'}>
                {task.type === taskType.BATCH && getBatchTaskInput({task})}
              </div>
            </div>
            <div className={'flex items-center gap-2 m-2'}>
              {task.type === taskType.IMAGE_GEN && getTaskInput({task})}
              {getTaskOutput({task})}
            </div>
          </div>
        </div>
        {task.type === taskType.IMAGE_GEN && <Executions executions={task.executions}/>}
        <div className={'grid md:grid-cols-2 gap-2'}>
          {
            task.type === taskType.BATCH && task.children?.map((item, index) => (
              <TaskItem task={item} key={index} className={'max-w-auto'}>
                {getTaskOutput({task: item})}
              </TaskItem>
            ))
          }
        </div>
      </div>
    </div>
  </>
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
        <div className={'relative h-32 w-32'}>
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

const getTaskOutput = ({task}:{task: Task}) => {

  const status = task.status

  const execution = task.executions?.[0]

  switch (status) {
    case taskStatus.PENDING:
      return <div>正在等待中⌛️</div>
    case taskStatus.FAILED:
      return <div className={'text-red-500'}>执行失败</div>
    case taskStatus.PROCESSING:
      return <div className={'text-blue-500'}>执行中...</div>
  }

  if(execution?.output?.url) {
    return <img src={task.executions?.[0].output?.url} className={'max-h-32'} />
  }
  return <>
    <div className={'flex items-center gap-2'}>

    </div>
  </>
}