import { Timer } from "lucide-react";
import React from "react";
import {cn, formatDuration} from "@/lib/utils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration)

type Props = React.HTMLProps<HTMLDivElement> & {
  duration: number
}

export default function Duration({duration, className, ...rest}: Props) {
  return <div className={cn(className,'flex justify-center')} {...rest}>
    <Timer />{formatDuration(duration)}
  </div>
}