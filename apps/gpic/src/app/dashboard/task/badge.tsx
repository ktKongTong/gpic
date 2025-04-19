import { Badge as ShadcnBadge } from "@/components/ui/badge";
import {cva, VariantProps} from "class-variance-authority";
import {taskStatus, TaskStatus, taskType, TaskType} from "@repo/service/shared";
import {cn} from "@/lib/utils";
import {AlertTriangle, CheckCircle2, Clock} from "lucide-react";

const badgeVariant = cva(
  '',
  {
    variants: {
      color: {
        blue: "bg-blue-500/20 text-blue-400 border-blue-500/20",
        white: "bg-white/20 text-white border-white/20",
        yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
        green: "bg-green-500/20 text-green-400 border-green-500/20",
        lime: "bg-lime-500/20 text-lime-400 border-lime-500/20",
        red: "bg-red-500/20 text-red-400 border-red-500/20",
      },
    },
    defaultVariants: {
      color: "white",
    },
  }
)

type BaseBadgeProps = React.PropsWithChildren<React.ComponentProps<typeof ShadcnBadge>> & VariantProps<typeof badgeVariant>


const BaseBadge:React.FC<BaseBadgeProps> = ({color, className, children, ...rest}) => {
  return <ShadcnBadge className={cn(badgeVariant({color}),"text-xs", className)} {...rest}>{children}</ShadcnBadge>
}


type StatusBadgeProps = BaseBadgeProps & {
  status: TaskStatus
}
export function StatusBadge({status}: StatusBadgeProps) {
  return (
    <>
      {status === taskStatus.PENDING && <BaseBadge color={'white'}><Clock className="h-3 w-3" /><span>Pending</span></BaseBadge>}
      {status === taskStatus.PROCESSING && <BaseBadge color={'yellow'}><CheckCircle2 className="h-3 w-3" /><span>Processing</span></BaseBadge>}
      {status === taskStatus.SUCCESS && <BaseBadge color={'lime'}><CheckCircle2 className="h-3 w-3" /><span>Completed</span></BaseBadge>}
      {status === taskStatus.FAILED && <BaseBadge color={'red'}><AlertTriangle className="h-3 w-3" /><span>Failed</span></BaseBadge>}
    </>
  )
}

type TypeBadgeProps = BaseBadgeProps & {
  type: TaskType
}

export function TypeBadge({type}: TypeBadgeProps) {
  return (
    <>
      {type === taskType.IMAGE_GEN && <BaseBadge color={'white'}><span>Image-Gen</span></BaseBadge>}
      {type === taskType.BATCH && <BaseBadge color={'yellow'}><span>Batch</span></BaseBadge>}
    </>
  )
}


type RetryBadgeProps = BaseBadgeProps & {
  retry: number
}
export function RetryBadge({retry}: RetryBadgeProps) {
  return (
    <BaseBadge color={'white'}>重试{retry}次</BaseBadge>
  )
}