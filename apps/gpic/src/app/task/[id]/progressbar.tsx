import React from "react";
import {cn} from "@/lib/utils";

interface ProgressSegmentProps {
  color: string;
  percentage: number;
  count: number;
}
const ProgressSegment: React.FC<ProgressSegmentProps> = ({ color, percentage, count }) => {
  return (
    <div
      className={cn(
        `overflow-hidden text-nowrap flex items-center justify-center h-full`,
        ` text-white text-xs font-medium`,
        color
      )}

      style={{ width: `${percentage}%`,
      }}
      aria-valuenow={percentage}
      aria-label={`${count} tasks`}
      role="progressbar"
    >
      {percentage > 5 && <span>{count}</span>}
    </div>
  );
};
interface ProgressBarProps {
  data: {
    completed: number;
    processing: number;
    pending: number;
    failed: number;
    total: number;
  };
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ data }) => {
  const total = data.total
  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return (count / total) * 100;
  }
  const status = [
    { name: '等待中', color: 'bg-gray-400/50', percentage: getPercentage(data.pending), count: data.pending },
    { name: '处理中', color: 'bg-orange-500/90', percentage: getPercentage(data.processing), count: data.processing },
    { name: '失败', color: 'bg-red-500/40', percentage: getPercentage(data.failed), count: data.failed },
    { name: '已完成', color: 'bg-lime-400/60', percentage: getPercentage(data.completed), count: data.completed },
  ]
  return (

    <div className="flex w-full h-4 rounded-full overflow-hidden max-w-96 my-2">
      {total === 0 ? (
        <div className="flex items-center  justify-center h-full w-full  text-xs italic rounded-full">
          暂无任务
        </div>
      ) : (
        <>
          {
            status.map((segment, index) => (
              <ProgressSegment
                key={segment.name}
                color={segment.color}
                percentage={segment.percentage}
                count={segment.count}
              />)
            )
          }
        </>
      )
      }
    </div>

  );
};
