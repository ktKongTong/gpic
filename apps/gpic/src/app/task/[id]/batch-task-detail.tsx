import {formatDate, formatDuration, relativeDate} from "@/lib/utils";
import {StatusBadge, TypeBadge} from "@/components/task/badge";
import {AttemptMenu} from "@/app/task/[id]/attempt-menu";
import {RetryButton} from "@/app/task/[id]/retry-button";
import React from "react";
import {BatchImageTask, ImageTask} from "@/lib/type";
import {taskStatus} from "@repo/service/shared";
import TaskItem from "@/app/task/task-item";
import {taskType} from "@repo/service/shared";
import {Calendar, Clock7, Ellipsis} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenuArrow} from "@radix-ui/react-dropdown-menu";
import {Button} from "@/components/ui/button";
import {TaskItemV2} from "@/app/task/task-item-v2";


type BatchImageTaskDetailProps = {
  task: BatchImageTask;
}

type Styles = {
  style: string,
}

type BatchTaskItem = {
  url: string,
  count: number,
  styles: string[]
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
      times: task.input.times,
    }
  })
  return units.map(it => {
    const matched = children.filter(child => child.input.files.includes(it.file))
    const output = matched.map(it => it.executions?.[0].output?.url).filter(Boolean) as string[]
    return {
      url: it.file,
      count: it.times,
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
              <div className={'rounded-full m-1 text-xs px-2 py-0.5  bg-black/40'} key={i}>
                {style}
              </div>
            )
          }
        </div>

      </div>
    </>
  )
}

export default function BatchTaskImageDetail({task}: BatchImageTaskDetailProps) {
  const taskItem = getTaskItem(task)
  return <>
    <div className={'flex items-center justify-between w-full h-full'}>
      <div>
          <h3 className={'text-3xl font-bold'}>{task.name}</h3>
          <div className={'items-center justify-start gap-2  text-xs flex'}>
            <span className={'inline-flex items-center gap-1'}><Clock7 className={'h-3 w-3'}/>{formatDuration(4090)}</span>
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
          <DropdownMenuTrigger><Button className={'bg-transparent text-white hover:bg-transparent hover:text-white border-white/30'} variant={'outline'} size={'icon'}><Ellipsis /></Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{'rerun failed'}</DropdownMenuItem>
            <DropdownMenuItem>{'rerun failed'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className="p-4 h-full w-full">
      <div className="flex flex-col w-full">
        <div className={'text-3xl'}>Children</div>
        {/*progressbar*/}
        { task.status === taskStatus.PENDING && <>排队中</> }
        { task.status === taskStatus.PROCESSING && <>处理中...</> }
        { task.status === taskStatus.FAILED && <div className={'bg-red-500/30 rounded-lg p-3'}>
            <div className={'text-red-400'}>Error</div>
              show logs
            </div>
        }
        <div className={'grid md:grid-cols-2 gap-2'}>
          {
            task.children?.map((item, index) => (
              <TaskItemV2 task={item} key={index} className={'max-w-auto'}/>
            ))
          }
        </div>
      </div>
    </div>
  </>
}