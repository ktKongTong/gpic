import { BatchImageTask } from "@/hooks/use-task";
import {cn, relativeDate} from "@/lib/utils";
import { Layers } from "lucide-react";
import {StatusBadge} from "@/components/task/badge";
import {taskStatus} from "@repo/service/shared";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Carousel, CarouselContent, CarouselItem, useCarousel} from "@/components/ui/carousel";
import React, {useState} from "react";

type BatchTaskItemProps = {
  task: BatchImageTask
} & React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;


type Unit = {
  input: {
    file: string
    style?: string
  },
  output: string[]
}

const combineImagesImage = (task: BatchImageTask) => {
  const children = task.children ?? []
  const units = task.input.files.map((file, i) => {
    return {
      file,
      style: task.input.style,
    }
  })
  return units.map(it => {
    const matched = children.filter(child => child.input.files.includes(it.file))
    const output = matched.map(it => it.executions?.[0].output?.url).filter(Boolean) as string[]
    return {
      ...it,
      output
    }
  })
}




export function BatchTaskItem ({task, children, className, ...rest}:BatchTaskItemProps) {
  const inputImage = combineImagesImage(task)
  const [idx, setIndex] = useState(0)
  const inputImages = inputImage.map(i => i.file)
  const f= inputImage.map(i => i.output?.[0] ?? i.file)[0]
  return <>
    <div
      className={cn(
        "border   rounded-lg mb-3 transition-all",
        "relative border-white/20 hover:border-white/40 bg-white/5",
        className
      )}
      {...rest}
    >
      <div className={'max-h-32 flex'}>
        <div className={'relative inset-0 max-w-32'}>
          <Carousel className="max-w-32">
            <CarouselContent>
              {inputImages.map((it, index) => (
                <CarouselItem key={index}>
                  <img src={it} className={'aspect-square max-w-32 h-full object-cover rounded-l-lg'}/>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className={'absolute w-full flex flex-col items-start p-0.5 bottom-0 bg-gradient-to-b from-transparent to-black/60'}>
            <span className="text-white inline-flex gap-1 items-center text-xs">
              <Layers className={'w-3 h-3'}/>
                {task.name}
            </span>
            <span className={'text-xs'}>{relativeDate(task.createdAt)}</span>
            <div className={'inline-flex items-center text-xs'}>
            </div>
          </div>

        </div>
        <div className={'relative justify-center items-center  w-full flex overflow-hidden bg-gray-400/50 rounded-r-lg'}>
          <img src={f} className={
          cn(
            'inset-0 aspect-square max-h-32 h-full object-cover',
            task.status !== taskStatus.SUCCESS && 'blur-lg'
          )
          }/>
          <div className={'absolute top-0 rounded-tr-lg flex flex-col items-end w-full text-xs p-1 bg-gradient-to-t from-transparent to-black/30'}>
            <StatusBadge status={task.status} />
          </div>
          <div className={'absolute bottom-0 rounded-tr-lg flex flex-col items-end w-full text-xs p-1 bg-gradient-to-b from-transparent to-black/30'}>
            <Button  size={'sm'} variant={'link'} className={'text-xs bg-transparent hover:bg-transparent text-white'}>
              <Link href={`/task/${task.id}`}>查看详情</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </>
}