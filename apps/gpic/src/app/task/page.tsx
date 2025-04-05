'use client'
import React from "react";
import {useTasks} from "@/hooks/use-task";
import {cn} from "@/lib/utils";
import TaskItem from "./task-item";

export default function () {
  const {tasks, setSelectedTask, selectedTask} = useTasks()

  return <>
    <main className="flex-1 flex flex-col w-full items-start p-4 md:p-8">
      <div className={'text-2xl font-bold my-4'}>Task History</div>
      <div className={cn(`mx-auto w-full gap-6 h-full`)}>
        <div className={cn(`md:grid-cols-3 sm:grid-cols-2 grid  w-full gap-2`)}>
          {tasks.map((task) => {
            return <TaskItem
              key={task.id}
              task={task}
              onClick={() => {}}
              selected={false}
            />
          })}
        </div>
      </div>
    </main>
  </>

}