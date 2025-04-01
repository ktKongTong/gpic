import {useRef} from "react";

export const useDebounce = <T extends any[]>(f: (...args: T) => (Promise<void> | void), option?:{wait?: number, immediate?: boolean}) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: T) => {
    const later = () => {
      timeout.current = null;
      if (!option?.immediate) {
        f(...args);
      }
    };

    const callNow = option?.immediate && !timeout.current;

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(later, option?.wait ?? 1000);

    if (callNow) {
      f(...args);
    }
  };
}