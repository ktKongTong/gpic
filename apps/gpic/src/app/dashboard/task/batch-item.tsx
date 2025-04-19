import {BatchImageTask, Task} from "@/hooks/use-task";
import {cn, relativeDate} from "@/lib/utils";
import {StatusBadge} from "./badge";
import {taskType} from "@repo/service/shared";
import {Layers} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {taskStatus} from "@repo/service/shared";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import React, {useState} from "react";

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

type Style = {
  styleId: string
} | {
  prompt: string,
  reference: string[]
}

type TaskResult = {
  input: string,
  output: { style: Style, url?: string, status?: string }[],
}

type BatchTaskItemProps = {
  task: BatchImageTask,
  result: TaskResult[],
} & React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;


const TaskItem: React.FC<BatchTaskItemProps> = ({ task, onClick, result, className,children, ...rest }) => {
  const [idx, setIndex] = useState(0)
  const current = result[idx]
  return (

    <div
      className={cn(
        " rounded-lg relative aspect-square overflow-hidden max-w-64",
        "z-auto",
        className
      )}

      {...rest}
    >
      <Carousel className={
        cn(
          "w-full inset-0 aspect-square  bg-black/40  backdrop-blur-sm",
          task.status !== taskStatus.SUCCESS && 'blur-sm'
        )
      }
      >
        <CarouselContent>
          {current.output.map((it, index) => (
            <CarouselItem key={index}>
              <img src={it?.url ?? current.input} alt={'Expect output'} className={cn('h-full object-cover aspect-square z-0')
              }/>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className={'absolute top-0 from-transparent to-black/60 bg-gradient-to-t w-full p-2'}>
        <div className="flex w-full items-center justify-between mb-2">
          <h3 className="font-medium text-white">
            <span className="text-white inline-flex gap-1 items-center">
            { task.type === taskType.BATCH && <Layers className={'w-3 h-3'}/> }
              { task.name }
            </span>
          </h3>
          <StatusBadge status={task.status} />
        </div>
      </div>

      <div className=" absolute bottom-0 text-xs w-full mt-auto p-2  from-transparent to-black/60 bg-gradient-to-b">
        <div className={'flex gap-2 w-full items-center justify-start overflow-x-auto'}>
          {
            result.map((img, i) =>
              <Image
                key={(img.input)+i}
                alt={'input image'}
                onClick={() => setIndex(i)}
                className={'rounded-md object-cover aspect-square'}
                src={img.input}
                width={40}
                height={40} />
            )
          }
        </div>
        <div className={'flex w-full items-center justify-between'}>
          <span>{relativeDate(task.createdAt)}</span>
          <div className={'w-fit flex items-center'}>
            <Button variant={'link'} size={'sm'} className={'text-white'}>
              <Link href={`/dashboard/task/${task.id}`}>查看详情</Link>
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default TaskItem;