import {BatchImageTask, Task} from "@/hooks/use-task";

type BatchTaskItemProps = {
  task: BatchImageTask
}

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
// item [[input, output...],[[input, output...]]]
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

export default function BatchTaskItem({task}:BatchTaskItemProps) {
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
        <img src={item}
             key={item} className={'shrink-0 w-12 h-12 rounded-lg object-cover rotate-12'} />)
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