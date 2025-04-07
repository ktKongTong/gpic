'use client'
import React from "react";
import {Task, useTasks} from "@/hooks/use-task";
import {cn} from "@/lib/utils";
import TaskItem from "./task-item";
import {taskType} from "@repo/service/shared";
import {BatchTaskItem} from "@/app/task/batch-task-item";
import {TaskItemV2} from "@/app/task/task-item-v2";

const TaskComponent = ({task}:{task: Task}) => {
  if(task.type === taskType.IMAGE_GEN) {
    return <TaskItemV2 task={task as any}/>
  }
  return <BatchTaskItem task={task as any}/>
}

export default function () {
  const { tasks } = useTasks()
  return <>
    <main className="flex-1 flex flex-col w-full items-start p-4 md:p-8">
      <div className={'text-2xl font-bold my-4'}>Tasks</div>
      <div className={cn(`md:grid-cols-3 sm:grid-cols-2 grid  w-full gap-2`)}>
        {tasks.map((task) => <TaskComponent key={task.id} task={task}/>)}
      </div>
    </main>
  </>

}