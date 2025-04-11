'use client'
import React from "react";
import {Task, useTasks} from "@/hooks/use-task";
import {taskType} from "@repo/service/shared";
import TaskItem from "./task-item";
import BatchItem from "./batch-item";


const TaskComponent = ({task}:{task: Task}) => {
  if(task.type === taskType.IMAGE_GEN) {
    return <TaskItem task={task as any}/>
  }
  return <BatchItem task={task as any}/>
}



export default function Page() {
  const {tasks} = useTasks();
  return <>
    <div className={'p-2 pb-4 sm:px-4 md:px-10 w-full grow'}>
      <div className={'text-2xl font-bold my-4'}>Tasks</div>
      <div className={'grid gap-2 w-full grid-cols-3 items-center grow p-2'}>
        {tasks.map((task) => <TaskComponent key={task.id} task={task}/>)}
      </div>
    </div>

  </>
}