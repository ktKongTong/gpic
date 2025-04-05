'use client'
import React, { useState } from 'react';
import {BatchImageTask, Task, useTasks} from "@/hooks/use-task";
import TaskItem from "@/components/task/item";
import TaskDetails from "@/components/task/detail";
interface TaskViewProps {
  className?: string;
}

const TaskView: React.FC<TaskViewProps> = ({ className }) => {
  const {tasks, setSelectedTask, selectedTask} = useTasks()

  const handleRetry = (task: Task) => {
    // if (onRetryTask) {
    //   onRetryTask(task);
    // }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 h-full ${className || ''}`}>
      <div className="lg:col-span-1 overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Task History</h2>
        <div className={`space-y-2 ${className || ''}`}>
          {/*@ts-ignore*/}
          {tasks.map((task:BatchImageTask ) => {
            if(task.children) {
              return <>
                {
                  task.children.map(child => <TaskItem
                    key={child.id}
                    task={child}
                    onClick={() => setSelectedTask(child)}
                    selected={selectedTask?.id === child.id}
                  />)
                }
              </>
            }

            return <TaskItem
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task)}
              selected={selectedTask?.id === task.id}
            />


          })}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-2 bg-card/20 rounded-xl backdrop-blur-sm overflow-auto">
        <TaskDetails task={selectedTask as any} onRetry={handleRetry} />
      </div>
    </div>
  );
};

export default TaskView;