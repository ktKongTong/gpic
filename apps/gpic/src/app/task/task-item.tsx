import {BatchImageTask, ImageTask, Task} from "@/hooks/use-task";
import {cn, formatDate, relativeDate} from "@/lib/utils";
import {StatusBadge} from "@/components/task/badge";
import {taskType} from "@repo/service/shared";
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
        " border rounded-lg mb-3 transition-all",
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

      <div className="text-xs text-white/50 flex justify-between items-center mt-auto">
        <span>{relativeDate(task.createdAt)}</span>
        <div className={'w-fit flex items-center'}>
          <Button variant={'link'} size={'sm'} className={'text-white/50 hover:text-white'}>
            <Link href={`/task/${task.id}`}>查看详情</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;