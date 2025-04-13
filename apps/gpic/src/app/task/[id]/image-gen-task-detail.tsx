'use client'
import {ImageTask} from "@/lib/type";
import {formatDate, formatDuration, relativeDate} from "@/lib/utils";
import {StatusBadge, TypeBadge} from "../badge";
import React, {useEffect, useState} from "react";
import {taskStatus, taskType} from "@repo/service/shared";
import {Calendar, Clock7, Ellipsis, LucideMenu} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Markdown from "react-markdown";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {useMutation} from "@tanstack/react-query";
import { mutationKeys } from "@/lib/query";
import {useDuration} from "./duration";
import Style from "@/app/task/[id]/style";

type ImageGenTaskDetailProps = {
  task: ImageTask;
}

export const ImageGenTaskDetail = ({task}: ImageGenTaskDetailProps) => {
  const first = task.executions?.[0]
  const [execId, setExecId] = useState(first?.id)
  const current = task.executions.find(it => it.id === execId)
  const startTime = current?.startedAt
  const endTime = current?.endedAt
  const {duration} = useDuration(startTime, endTime)
  const status = current?.status ?? task.status
  const {mutate: retryTask } = useMutation<unknown, unknown,string>({mutationKey: mutationKeys.task.retry})


  const currentIdx = task.executions.length - task.executions.findIndex(it => it.id === execId)
  const execMenu = task.executions.map((it,idx) => ({...it, idx: task.executions.length - idx}))
  return <>
  <div className={'flex items-center justify-between w-full h-full'}>
    <div>
      <h3 className={'text-3xl font-bold text-ellipsis line-clamp-1'}>{task.name}</h3>
      <div className={'block md:hidden'}>
        <div className={'items-center justify-start gap-2  text-xs flex'}>
          <span className={'inline-flex items-center gap-1'}><Clock7 className={'h-3 w-3'}/>{formatDuration(duration)}</span>
          <span className={'inline-flex items-center gap-1'}><Calendar className={'h-3 w-3'}/>{relativeDate(task.createdAt)}</span>
        </div>
        <div className={'flex gap-2 items-center'}>
          <StatusBadge status={status} />
          <TypeBadge type={task.type} />
        </div>
      </div>
    </div>
    <div className={'flex gap-2 items-center'}>
      {
        execMenu.length > 0 && <>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button className={''} variant={'secondary'} size={'sm'}>Exec #{currentIdx}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {
                      execMenu.map((exec) =>
                        <DropdownMenuItem
                          key={exec.id}
                          onClick={() => {setExecId(exec.id)}}
                        >
                          Exec #{exec.idx}
                        </DropdownMenuItem>
                      )
                    }
                  </DropdownMenuContent>
              </DropdownMenu>
          </>
      }
      {
        task.status === 'failed' && <DropdownMenu>
          <DropdownMenuTrigger asChild><Button className={''} variant={'secondary'} size={'icon'}><Ellipsis /></Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem  onClick={() => {retryTask(task.id)}}>
              {'rerun failed'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </div>
  </div>
  <div className="p-4 h-full w-full">
    <div className="flex flex-col w-full">
      <div className={'flex flex-col md:flex-row md:items-start items-center gap-2 px-2'}>
        <Carousel className="max-w-64 min-w-40 aspect-square">
          <CarouselContent>
            {
              task.input.files.map((file, i) =>
                  <CarouselItem key={i}>
                    <img src={file} key={file} className={'rounded-lg aspect-square object-cover'} />
                    {task?.input?.style && <Style styleInfo={task?.input?.style}/>}
                  </CarouselItem>
              )
            }
          </CarouselContent>
        </Carousel>
        <div className={'flex flex-col w-full gap-2 items-center md:items-start'}>
          <div className={'hidden md:block'}>
            <div className={'items-center justify-start gap-2  text-xs flex'}>
              <span className={'inline-flex items-center gap-1'}><Clock7 className={'h-3 w-3'}/>{formatDuration(duration)}</span>
              <span className={'inline-flex items-center gap-1'}><Calendar className={'h-3 w-3'}/>{relativeDate(task.createdAt)}</span>
            </div>
            <div className={'flex gap-2 items-center'}>
              <StatusBadge status={status} />
              <TypeBadge type={task.type} />
            </div>
          </div>
          { status === taskStatus.PENDING && <>queueing</> }
          { status === taskStatus.PROCESSING && <>processing</> }
          { status === taskStatus.FAILED && <div className={'relative overflow-y-auto bg-red-500/30 rounded-lg p-3'}>
              <div className={'text-red-400'}>Error</div>
              <div className={'overflow-auto whitespace-pre-wrap'}>
                  <Markdown>{current?.state?.message}</Markdown>
              </div>
          </div> }
          {
            status === taskStatus.SUCCESS &&
              <img src={current?.output?.url} className={'max-w-64 md:max-w-48  rounded-lg aspect-square'} />
          }
        </div>
      </div>

    </div>
  </div>
</>
}