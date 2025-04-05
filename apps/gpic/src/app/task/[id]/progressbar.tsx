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
        `overflow-hidden text-clip text-nowrap flex items-center justify-center h-full`,
        ` text-white text-xs font-medium backdrop-blur-2xl opacity-70`,
        color,
        ` transition-all duration-500 ease-out`
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
    { name: '已完成', color: 'bg-lime-400/40', percentage: getPercentage(data.completed), count: data.completed },
    { name: '处理中', color: 'bg-blue-400/40', percentage: getPercentage(data.processing), count: data.processing },
    { name: '等待中', color: 'bg-gray-400/30', percentage: getPercentage(data.pending), count: data.pending },
    { name: '失败', color: 'bg-red-500/40', percentage: getPercentage(data.failed), count: data.failed },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4">
        <div className="flex w-full h-4 rounded-full overflow-hidden border border-gray-300 bg-gray-200">
          {total === 0 ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500 text-xs italic rounded-full">
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
      </div>
      {/* 图例 */}
      {/*<Legend data={data} statusConfig={statusConfig} />*/}
    </div>
  );
};
