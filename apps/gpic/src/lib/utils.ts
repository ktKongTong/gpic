import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// export const formatDuration = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleString();
// };

// seconds
export const formatDuration = (duration: number) => {
//   484 -> 8m4s
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}m${seconds}s`;
}

export const relativeDate = (dateString: string) => {
  return dayjs().to(dayjs(dateString));
};

export const truncate = (str: string, length: number = 20) => {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + "...";
}