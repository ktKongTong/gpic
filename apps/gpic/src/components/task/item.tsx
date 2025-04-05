import { Task } from "@/hooks/use-task";
import {cn, formatDate} from "@/lib/utils";
import {StatusBadge} from "@/components/task/badge";
import {ImageGenInput, ImageGenTaskItem} from "@/components/task/image-view";
import TaskDetails from "@/components/task/detail";


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
      <ImageGenTaskItem task={task as any} />
      <div className="text-xs text-white/50 flex justify-between">
        <span>{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
};

export default TaskItem;