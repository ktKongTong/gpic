import {BatchImageTask, ImageTask, Task} from "@/hooks/use-task";
import {cn, formatDate, relativeDate} from "@/lib/utils";
import {CheckCircle2, Layers} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

type BatchTaskItemProps = {
  task: BatchImageTask
} & React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;

const inputImages = (task: BatchImageTask) => {
  return task.input.files as string[]
}

const outputImages = (task: BatchImageTask) => {
  const images = task.children?.flatMap((child) => {
    return child.executions.map(execution => execution.output?.url).filter(Boolean)
  })
  return images as string[]
}

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
  const f= inputImage.map(i => i.file)[0]
  return <>
    <div
      className={cn(
        "border flex   rounded-lg mb-3 transition-all",
        "relative border-white/20 hover:border-white/40 bg-white/5",
        className
      )}
      {...rest}
    >
      <img src={f} className={'inset-0 aspect-square max-w-32 h-full object-cover rounded-l-lg'}/>
      <div className={'flex flex-col items-start'}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">
          <span className="text-white inline-flex gap-1 items-center">
            <Layers className={'w-3 h-3'}/>
            <CheckCircle2 className={'w-3 h-3 text-lime-500/50'}/>
            {task.name}
          </span>
        </h3>
        {/*<StatusBadge status={task.status} />*/}
      </div>
      {children ?? <BatchTaskItemShow task={task as BatchImageTask} />}
      <div className="text-xs text-white/50 flex justify-between items-center mt-auto">
        <span>{relativeDate(task.createdAt)}</span>
        <div className={'w-fit flex items-center'}>
          {/*{*/}
          {/*  (task.status===taskStatus.FAILED ||task.status===taskStatus.SUCCESS) &&*/}
          {/*    <Button*/}
          {/*        variant={'link'}*/}
          {/*        size={'sm'}*/}
          {/*        className={'px-0 text-white/50 hover:text-white'}*/}
          {/*    >重试</Button>*/}
          {/*}*/}
          <Button variant={'link'} size={'sm'} className={'mx-auto text-white/50 hover:text-white'}>
            <Link href={`/task/${task.id}`}>查看详情</Link>
          </Button>
        </div>
      </div>
      </div>
    </div>
  </>
}

export function BatchTaskItemShow({task}:BatchTaskItemProps) {
  const inputImage = combineImagesImage(task)

  return <div className={'flex gap-2'}>
    <div className={'gap-4 flex basis-full'}>
      {
        inputImage.map((it, i) =>
          <div className={'flex gap-2'} key={i}>
            <StackedImages images={[it.file, ...it.output]}/>
          </div>
        )
      }
    </div>
    </div>
}

function FlatImages({images}:{images:string[]}) {
  return <div className={'flex gap-2'}>
    {
      images.map((item, i) =>
        <img src={item} key={item} className={'shrink-0 w-12 h-12 rounded-lg object-cover rotate-12'} />)
    }
  </div>
}
function StackedImages({images}:{images:string[]}) {
  return <div className={'relative w-12 h-12 gap-2 hover:flex '}>
    {
      images.map((item, i) =>
        <img src={item}
        key={item} className={'absolute shrink-0 w-12 h-12 rounded-lg object-cover'}
        style={{
          rotate: `${i * 2}deg`,
          transform: `translateX(${i * 2}px)`,
        }}
        />)
    }
  </div>
}