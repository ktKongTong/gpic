import { formatDuration, relativeDate } from "@/lib/utils";
import {StatusBadge, TypeBadge} from "../badge";
import React from "react";
import { BatchImageTask } from "@/lib/type";
import {taskStatus} from "@repo/service/shared";
import {Calendar, Clock7, Ellipsis} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TaskItem from "@/app/task/task-item";
import {useMutation} from "@tanstack/react-query";
import {mutationKeys} from "@/lib/query";
import {useDuration} from "@/app/task/[id]/duration";
import {ProgressBar} from "@/app/task/[id]/progressbar";


type BatchImageTaskDetailProps = {
  task: BatchImageTask;
}

type Styles = {
  style: string,
}

type BatchTaskItem = {
  url: string,
  count: number,
  styles: any[]
  output: {
    url: string,
    state: string,
  }[]
}

const getTaskItem = (task: BatchImageTask): BatchTaskItem[] => {
  const children = task.children ?? []
  const units = task.input.files.map((file, i) => {
    return {
      file,
      style: task.input.style,
      count: task.input.count,
    }
  })
  return units.map(it => {
    const matched = children.filter(child => child.input.files.includes(it.file))
    const output = matched.map(it => it.executions?.[0]?.output?.url).filter(Boolean) as string[]
    return {
      url: it.file,
      count: it.count,
      styles: it.style,
      output: output.map(it => ({ url: it, state: 'state' }))
    }
  })
}

type ImageItemProps = {
  url: string,
  styles: string[],
  count?: number,
  state?: string
}

const ImageItem = ({taskItem}:{taskItem: ImageItemProps}) => {
  return (
    <>
      <div className={'relative h-32 rounded-lg'}>
        <img src={taskItem.url} className={'h-32 rounded-lg object-cover'} />
        <div className={'absolute right-0 bottom-0'}>
          {
            taskItem.styles.map((style, i) =>
              <div className={'rounded-full m-1 text-xs px-2 py-0.5'} key={i}>
                {style}
              </div>
            )
          }
        </div>

      </div>
    </>
  )
}

const state = {
  total: 100,
  pending: 10,
  processing: 20,
  completed: 40,
  failed: 30,
}

export default function BatchTaskImageDetail({task}: BatchImageTaskDetailProps) {
  const {mutate: retryTask } = useMutation<unknown, unknown,string>({mutationKey: mutationKeys.task.retry})
  const {duration} = useDuration(task.startedAt, task.endedAt)

  return <>
    <div className={'flex items-center justify-between w-full h-full'}>
        <div>
          <h3 className={'text-3xl font-bold text-ellipsis line-clamp-1'}>{task.name}</h3>
          <div className={'items-center justify-start gap-2  text-xs flex'}>
            <span className={'inline-flex items-center gap-1'}><Clock7 className={'h-3 w-3'}/>{formatDuration(duration)}</span>
            <span className={'inline-flex items-center gap-1'}><Calendar className={'h-3 w-3'}/>{relativeDate(task.createdAt)}</span>
            <div className={'items-center gap-1 hidden sm:flex'}>
              <StatusBadge status={task.status} />
              <TypeBadge type={task.type} />
            </div>
          </div>
          <div className={'items-center gap-1 flex p-2 sm:hidden'}>
            <StatusBadge status={task.status} />
            <TypeBadge type={task.type} />
          </div>
        </div>
      <div className={'flex gap-2 items-center'}>
        <DropdownMenu>
          <DropdownMenuTrigger><Button className={''} variant={'secondary'} size={'icon'}><Ellipsis /></Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => retryTask(task.id)}>{'rerun failed'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className="p-4 h-full w-full">
      <div className="flex flex-col w-full items-center justify-center ">
        <ProgressBar data={state}/>
        { task.status === taskStatus.PENDING && <>排队中</> }
        { task.status === taskStatus.PROCESSING && <>处理中...</> }
        { task.status === taskStatus.FAILED && <div className={'bg-red-500/30 rounded-lg p-3'}>
            <div className={'text-red-400'}>Error</div>
              WIP
            </div>
        }
        <div className={'grid md:grid-cols-3 sm:grid-cols-2 justify-center justify-items-center gap-2'}>
          {
            task.children?.map((item, index) => (
              <TaskItem task={item} key={index} className={''}/>
            ))
          }
        </div>
      </div>
    </div>
  </>
}