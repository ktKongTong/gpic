import {ImageTask} from "@/lib/type";
import {formatDate, formatDuration, relativeDate} from "@/lib/utils";
import {StatusBadge, TypeBadge} from "@/components/task/badge";
import React from "react";
import {taskStatus, taskType} from "@repo/service/shared";
import {Calendar, Clock7, Ellipsis, LucideMenu} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Markdown from "react-markdown";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";

type ImageGenTaskDetailProps = {
  task: ImageTask;
}





export const ImageGenTaskDetail = ({task}: ImageGenTaskDetailProps) => {
  const execution = task.executions?.[0]
  return <>
  <div className={'flex items-center justify-between w-full h-full'}>
    <div>
      <h3 className={'text-3xl font-bold'}>{task.name}</h3>

    </div>
    <div className={'flex gap-2 items-center'}>
      <DropdownMenu>
        <DropdownMenuTrigger><Button className={'bg-transparent text-white hover:bg-transparent hover:text-white border-white/30'} variant={'outline'} size={'icon'}><Ellipsis /></Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{''}</DropdownMenuItem>
          {/*show available job*/}
          <DropdownMenuItem>{'rerun all job'}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
  <div className="p-4 h-full w-full">
    <div className="flex flex-col w-full">
      <div className={'flex items-start gap-2 px-2'}>
        <Carousel className="max-w-64 aspect-square">
          <CarouselContent>
            {
              task.input.files.map((file, i) =>
                  <CarouselItem key={i}>
                    <img src={file} key={file} className={'rounded-lg object-cover'} />
                    <div className={'rounded-full m-1 text-xs px-2 py-0.5  bg-black/40 absolute right-0 bottom-0'}>
                      {task.input.style}
                    </div>
                  </CarouselItem>
              )
            }
          </CarouselContent>
        </Carousel>
        <div className={'flex flex-col w-full gap-2'}>
          <div className={'items-center justify-start gap-2  text-xs flex'}>
            <span className={'inline-flex items-center gap-1'}><Clock7 className={'h-3 w-3'}/>{formatDuration(4090)}</span>
            <span className={'inline-flex items-center gap-1'}><Calendar className={'h-3 w-3'}/>{relativeDate(task.createdAt)}</span>
          </div>
          <div className={'flex gap-2 items-center'}>
            <StatusBadge status={task.status} />
            <TypeBadge type={task.type} />
          </div>
          { task.status === taskStatus.PENDING && <>queueing</> }
          { task.status === taskStatus.PROCESSING && <>processing</> }
          { task.status === taskStatus.FAILED && <div className={'bg-red-500/30 rounded-lg p-3'}>
              <div className={'text-red-400'}>Error</div>
              <div className={'overflow-hidden'}>
                  <Markdown>{execution?.state.message}</Markdown>
              </div>

          </div> }
        </div>
      </div>

      {
        task.status === taskStatus.SUCCESS &&
          <div className={'grid md:grid-cols-2 gap-2'}>
            <img src={execution.output?.url} className={'max-h-32  rounded-lg'} />
          </div>
      }
    </div>
  </div>
</>
}