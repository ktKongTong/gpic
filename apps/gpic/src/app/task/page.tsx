'use client'
import React from "react";
import {BatchImageTask, Task, useTasks} from "@/hooks/use-task";
import {taskType} from "@repo/service/shared";
import BatchItem from "./batch-item";

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

const combineImagesImage = (task: BatchImageTask):TaskResult[] => {
  const children = task.children ?? []
  const units = task.input.files.map((file, i) => {
    return {
      file,
      style: task.input.style,
    }
  })
  return units.map(it => {
    // groupTaskByFileInput
    const matched = children.filter(child => child.input.files.includes(it.file))
    const res = {
      input: it.file,
      output: matched.map(it => ({
        url: it.executions?.[0]?.output?.url,
        status: it.status,
        style: it.input.style as any,
      }))
    }
    return res
  })
}
const TaskComponent = ({task}:{task: Task}) => {
  if(task.type === taskType.IMAGE_GEN) {
    const inputImages = task.input.files as string[]
    const sortedExecution = task.executions.toSorted((a,b)=> b.createdAt.localeCompare(a.createdAt))
    const result = [{
      input: inputImages[0],
      output: [{
        style: task.input?.style as any,
        url: sortedExecution?.[0]?.output?.url ?? task.input.files?.[0],
        status: task.status,
      }]
    }]
    return <BatchItem task={task as any} result={result} />
  }
  // @ts-ignore
  const inputImage = combineImagesImage(task)
  return <BatchItem task={task as any} result={inputImage} />
}



export default function Page() {
  const {tasks} = useTasks();
  return <>
    <div className={'p-2 pb-4 sm:px-4 md:px-10 w-full grow relative'}>
      <div className={'text-2xl font-bold my-4'}>Tasks</div>
      <div className={'grid gap-2 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-items-center grow p-2'}>
        {tasks.map((task) => <TaskComponent key={task.id} task={task}/>)}
      </div>
    </div>

  </>
}