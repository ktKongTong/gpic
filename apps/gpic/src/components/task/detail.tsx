
import React, { useState } from 'react';

import { AlertCircle, CheckCircle2, Clock, Copy, RotateCcw, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Executions from "@/components/task/execution";
import {Execution, Task} from '@/hooks/use-task';
import {formatDate} from "@/lib/utils";
import {ImageGenInput, ImageGenOutput} from "@/components/task/image-view";

interface TaskDetailsProps<T extends Execution, M extends any = any> {
  task: Task<'image-gen',T, M> | null;
  onRetry?: (task: Task) => void;
}

const TaskDetails =
  <T extends Execution, M extends any = any>({ task, onRetry }:TaskDetailsProps<T,M>) => {
  if (!task) {
    return (
      <div className="h-full flex items-center justify-center text-white/70">
        Select a task to view details
      </div>
    );
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry(task);
      toast.success(`Retrying task: ${task.name}`);
    }
  };

  const inputRender = () => <ImageGenInput input={task.input} />
  const outputRender = () => <ImageGenOutput state={task.executions[0]?.state} status={task.status} output={task.executions[0]?.output} />

  return (
    <div className="p-4 h-full overflow-auto max-h-[480px]">
      <div className="flex flex-col">
        <div className="mb-4 pb-4 ">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-white">{task.name}</h2>
              <div className={'text-xs'}>
                <span className="text-white/50">创建于: </span>
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">

              {(task.status === 'failed' || task.status === 'completed') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetry}
                  className="h-8 border-white/20 bg-transparent hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </div>

          {/* Input summary */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <div>
                <span className="text-xs text-white/50 block mb-1">Input</span>
                <div className="bg-black/30 rounded p-2 text-sm">
                  {inputRender()}
                </div>
              </div>
              <div>
                <span className="text-xs text-white/50 block mb-1">Output</span>
                <div className="bg-black/30 rounded p-2 text-sm">
                  {outputRender()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Executions executions={task.executions} />
      </div>
    </div>
  );
};

export default TaskDetails;
