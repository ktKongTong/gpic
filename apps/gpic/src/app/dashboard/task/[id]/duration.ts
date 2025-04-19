import {useEffect, useState} from "react";


const getDuration = (start?: string, end?: string) => {
  if(!start) {
    return 0
  }
  if(end) {
    return Math.floor((Date.parse(end) - Date.parse(start))/1000)
  }
  return Math.floor((Date.now() - Date.parse(start))/1000)
}


export const useDuration = (startTime?: string, endTime?: string) => {
  const [duration, setDuration] = useState(getDuration(startTime, endTime))
  useEffect(() => {
    if (endTime || !startTime) {
      return
    }
    const cb = setInterval(() => {
      let time = new Date().toTimeString()
      const res = getDuration(startTime, time)
      setDuration(res)
    }, 1000)
    return () => {
      clearInterval(cb)
    }
  }, [startTime, endTime])
  return {
    duration
  }
}