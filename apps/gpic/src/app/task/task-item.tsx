import {BatchImageTask, ImageTask, Task} from "@/hooks/use-task";
import {cn, formatDate} from "@/lib/utils";
import {StatusBadge} from "@/components/task/badge";
import { ImageGenTaskItem } from "@/components/task/image-view";
import {taskType} from "@repo/service/shared";
import BatchTaskItem from "@/app/task/batch-task-item";
import {Layers} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";


type TaskItemProps = {
  task: Task;
} & React.HTMLProps<HTMLDivElement>;


const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, className,children, ...rest }) => {


  return (
    <div
      className={cn(
        "p-4 border rounded-lg mb-3 transition-all",
        "border-white/20 hover:border-white/40 bg-white/5",
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">
          <span className="text-white inline-flex gap-1 items-center">
          {task.type === taskType.BATCH && <Layers className={'w-3 h-3'}/>}
          {task.name}
          </span>
        </h3>
        <StatusBadge status={task.status} />
      </div>
      {children ?? <>
        {
          task.type === taskType.IMAGE_GEN && <ImageGenTaskItem task={task  as ImageTask} />
        }
        {
          task.type === taskType.BATCH && <BatchTaskItem task={task as BatchImageTask} />
        }
      </>}
      <div className="text-xs text-white/50 flex justify-between items-center">
        <span>{formatDate(task.createdAt)}</span>
        <div className={'w-fit flex items-center'}>
          <Button

            variant={'link'}
            size={'sm'}
            className={'px-auto text-white/50 hover:text-white'}
          >
            重试
          </Button>
          <Button variant={'link'} size={'sm'} className={'text-white/50 hover:text-white'}>
            <Link href={`/task/${task.id}`}>查看详情</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;