import {ImageExecution, ImageTask} from "@/hooks/use-task";
import {TaskStatus,taskStatus} from "@repo/service/shared";
import React from "react";
import {cn} from "@/lib/utils";

const ProgressBar = ({progress,  className, ...rest}: React.HTMLProps<HTMLDivElement> & {progress: number}) => {
  return <div className={cn(' bg-black/20 rounded-lg relative', className)} {...rest}>
    <div
      className={'absolute h-full top-0 bg-white/80 rounded-lg left-0 transition-[width]'}
      style={{width: `${progress}%`}}
    >
    </div>
  </div>
}


type BatchInputProps = {
  // files, times, style
  // 1 file | 1 style | 1 pic
  file: string[]
  input: {
    files: string[],
    prompt?: string,
    style?: string
  }
}

export const BatchImageGenInput: React.FC<BatchInputProps> = ({input: {files, prompt, style}}) => {
  return <>
    <div className={'flex items-center gap-1'}>
      {
        files.map((file, i) => <img src={file} key={file} className={'w-12 h-12 rounded-lg object-cover'} />)
      }
    </div>
    {
      prompt && (<p className={'text-xs'}>{prompt}</p>)
    }
  </>
}

type BatchImageGenOutputProps = {
  status: TaskStatus
  output?: {
    url: string,
  }
  state: ImageExecution['state']
}
export const BatchImageGenOutput: React.FC<BatchImageGenOutputProps> = ({output, status, state}) => {
  return <>
    {status === taskStatus.SUCCESS && <img src={output?.url!} className={'w-12 h-12 rounded-lg object-fill'} />}
    {status === taskStatus.FAILED &&
        <div className="text-red-400">
            <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap">{'Something Error'}</pre>
        </div>
    }
    {
      status === taskStatus.PROCESSING && <div className="text-yellow-400">
            processing...
        </div>
    }
    {status === taskStatus.PENDING &&
        <div className="text-center text-white/70">
            <p>Pending...</p>
        </div>
    }
  </>
}
type ImageGenTaskItemProps = {
  task: ImageTask
}
export const ImageGenTaskItem: React.FC<ImageGenTaskItemProps> = ({task}) => {
  return <div className={'flex items-center gap-2'}>
    <div className={'flex items-center gap-1'}>
      {
        task.input.files.map((file, i) => <img src={file} key={file} className={'w-12 h-12 rounded-lg object-cover'} />)
      }
    </div>
    <div className={'border-l border-white/20 px-2'}>
      <BatchImageGenOutput state={task.executions[0]?.state} status={task.status} output={task.executions[0]?.output}/>
    </div>
  </div>
}