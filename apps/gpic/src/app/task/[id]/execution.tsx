'use client'

import { ChevronDown, ChevronRight } from "lucide-react";
import {StatusBadge} from "@/components/task/badge";
import {ImageExecution} from "@/hooks/use-task";
import { useState } from "react";
import {ImageExecutionState, ImageGenInput, ImageGenOutput} from "@/components/task/image-view";
import {formatDate} from "@/lib/utils";

type ExecutionProps = {
  execution: ImageExecution[]
}
export default function Execution({execution}: ExecutionProps) {
  // start time, duration
  //
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <h3 className="text-lg font-medium text-white mb-3">Execution</h3>
      <div className="space-y-3">

      </div>
    </div>
  );
};

type ExecutionItemProps = {
  expanded: boolean,
  onselect: () => void,
  execution: ImageExecution,
  inputRender: () => React.ReactNode,
  outputRender: () => React.ReactNode,
  stateRender: () => React.ReactNode,
}

const ExecutionItem: React.FC<ExecutionItemProps> = ({ execution, onselect, expanded, inputRender, stateRender, outputRender }) => {
  return (
    <>
      <div className="bg-black/20 rounded-lg overflow-hidden">
        <div
          className="p-3 cursor-pointer flex items-center justify-between hover:bg-white/5"
          onClick={onselect}
        >
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="h-4 w-4 text-white/70" /> : <ChevronRight className="h-4 w-4 text-white/70" />}
            <span className="text-white">{execution.name}</span>
            <StatusBadge status={execution.status} />
          </div>
          <div className="text-sm text-white/50">
            {formatDate(execution.createdAt)}
          </div>
        </div>

        {expanded && (
          <div className="border-white/10 bg-white/5 p-3">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <div>
                <span className="text-xs text-white/50 block mb-1">Input</span>
                <div className="bg-black/30 rounded-lg p-2 text-sm">
                  {inputRender()}
                </div>
              </div>
              <div>
                <span className="text-xs text-white/50 block mb-1">Output</span>
                <div className="bg-black/30 rounded-lg p-2 text-sm">
                  {outputRender()}
                </div>
              </div>
            </div>
            <div>
              <span className="text-xs text-white/50 block mb-1">State</span>
              <div className="bg-black/30 rounded-lg  p-3 text-sm">
                {execution.state && stateRender()}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}

