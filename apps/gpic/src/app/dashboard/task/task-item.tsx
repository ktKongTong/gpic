import { Task } from "@/hooks/use-task";
import {cn, relativeDate} from "@/lib/utils";
import {StatusBadge} from "./badge";
import {taskType} from "@repo/service/shared";
import {Layers} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {taskStatus} from "@repo/service/shared";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import React from "react";

type TaskItemProps = {
  task: Task,


} & React.HTMLProps<HTMLDivElement>;

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, className,children, ...rest }) => {
  const inputImages = task.input.files as string[]
  const expectOutput: string = task.executions?.[0]?.output?.url ?? task.input.files[0]
  const outputs = [expectOutput]
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
            {outputs.map((it, index) => (
              <CarouselItem key={index}>
                <img src={it} alt={'Expect output'} className={cn('h-full object-cover aspect-square z-0')
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
              inputImages.map((img, i) =>
              <Image key={img+i} alt={'input image'} className={'rounded-md aspect-square'} src={img} width={40} height={40} />
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