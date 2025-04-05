import {ImageExecution, ImageTask} from "@/hooks/use-task";
import {TaskStatus,taskStatus} from "@repo/service/shared";
import React from "react";
import {cn} from "@/lib/utils";
import Markdown from "react-markdown";

const ProgressBar = ({progress,  className, ...rest}: React.HTMLProps<HTMLDivElement> & {progress: number}) => {
  return <div className={cn(' bg-black/20 rounded-lg relative', className)} {...rest}>
    <div
      className={'absolute h-full top-0 bg-white/80 rounded-lg left-0 transition-[width]'}
      style={{width: `${progress}%`}}
    >
    </div>
  </div>
}


export const ImageExecutionState = ({execution}: {execution: ImageExecution}) => {
  return (
    <div>
      {execution.state.progress && (
        <span className={'inline-flex'}>
        Progress: <ProgressBar progress={execution.state.progress} className={'my-2 w-32 h-2 ml-2'}/>
        </span>
      )}
      {execution.state.message && (
        <div className="py-2 overflow-x-auto">
          <Markdown>{execution.state.message}</Markdown>
          {/*<span className="text-white/70">Message:</span> {execution.state.message}*/}
        </div>
      )}
      {execution.state.error && (
        <div className="text-red-400">
          <span className="text-red-300">Error:</span> {execution.state.error}
        </div>
      )}
    </div>
  )
}

type ImageGenInputProps = {
  input: {
    files: string[],
    prompt?: string,
    style?: string
  }
}

export const ImageGenInput: React.FC<ImageGenInputProps> = ({input: {files, prompt, style}}) => {
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

type ImageGenOutputProps = {
  status: TaskStatus
  output?: {
    url: string,
  }
  state: ImageExecution['state']
}
export const ImageGenOutput: React.FC<ImageGenOutputProps> = ({output, status, state}) => {
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
      <ImageGenOutput state={task.executions[0]?.state} status={task.status} output={task.executions[0]?.output}/>
    </div>
  </div>
}