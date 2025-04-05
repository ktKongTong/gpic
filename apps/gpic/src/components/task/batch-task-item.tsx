import {ImageTask, Task} from "@/hooks/use-task";
import {cn, formatDate} from "@/lib/utils";
import {StatusBadge} from "@/components/task/badge";
import {ImageGenInput, ImageGenOutput, ImageGenTaskItem} from "@/components/task/image-view";
import React from "react";


interface TaskItemProps {
  task: Task;
  onClick?: () => void;
  selected?: boolean;
}


const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, selected = false }) => {

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border rounded-lg mb-3 cursor-pointer transition-all",
        selected ? "border-accent bg-accent/10" : "border-white/20 hover:border-white/40 bg-white/5",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">{task.name}</h3>
        <StatusBadge status={task.status} />
      </div>

      {/* all inputs? */}

      {/*progress bar*/}
      {/*state, */}
        <div className={'flex items-center gap-2'}>
          <div className={'flex items-center gap-1'}>
            {
              (task as ImageTask).input.files.map((file, i) => <img src={file} key={file} className={'w-12 h-12 rounded-lg object-cover'} />)
            }
          </div>
          {/* co */}
          <div className={'border-l border-white/20 px-2'}>
            <ImageGenOutput state={task.executions[0]?.state} status={task.status} output={task.executions[0]?.output}/>
          </div>
        </div>
      <ImageGenTaskItem task={task as any} />
      <div className="text-xs text-white/50 flex justify-between">
        <span>{formatDate(task.createdAt)}</span>
      </div>
      {/*{*/}
      {/*  selected && <div className={'block lg:hidden'}>*/}
      {/*        <TaskDetails task={task} />*/}
      {/*    </div>*/}
      {/*}*/}
    </div>
  );
};

export default TaskItem;