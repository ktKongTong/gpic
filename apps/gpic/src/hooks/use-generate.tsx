'use client'
import {useEffect, useRef, useState} from "react";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import {useFiles} from "@/hooks/use-file-upload";
import {useDebounce} from "@/hooks/use-debounce";
import {toast} from "sonner";


type ProgressEvent = {
  event: 'progress',
  // progress
  data: string
}

type GenerateSSEvent = {
  event: 'success',
  // url
  data: string
}

type ErrorSSEvent = {
  event: 'error',
  data: string
}
type StartSSEvent = {
  event: 'start',
  data: string
}
type FinishSSEvent = {
  event: 'end',
  data: string
}

export const states = {
  NOT_START: 'NOT_START',
  DRAWING: 'DRAWING',
  ERROR: 'ERROR',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
} as const
type State = typeof states[keyof typeof states]
type SSEvent = GenerateSSEvent | ProgressEvent | ErrorSSEvent | StartSSEvent | FinishSSEvent

type SingleFile = {
  fileId: string,
  style?: string,
  prompt?: string,
}

type MultiFile = {
  files: string[],
  style?: string,
  prompt?: string,
}

type GenerateProps = MultiFile

function downloadURI(uri: string) {
  let link = document.createElement("a");
  link.download = `tmp.png`
  link.href = uri;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const useGenerate = () => {
  const {files} = useFiles()
  const [state, setState] = useState<State>(states.NOT_START)
  const [progress, setProgress] = useState(0)
  const [url, setUrl] = useState('')
  const [tips, setTips] = useState('')

  const success = useRef(false)

  // sse
  const handleEvent = (event: SSEvent) => {
    switch (event.event) {
      case 'start':
        setState(states.DRAWING); break
      case 'progress':
        const progress = parseInt(event.data)
        setProgress(progress); break
      case 'error':
        setState(states.ERROR); break
      case "success":
        setUrl(event.data)
        setState(states.SUCCESS)
        setProgress(100)
        success.current = true; break
      case "end":
        if(!success.current) {
          toast.error("生成失败，请稍后再试")
        }
        setState(states.NOT_START)
        success.current = false
    }
  }
  const generate = async (props: GenerateProps) => {
    // console.log(props.files, files)
    if(state != states.NOT_START) {toast('在画了..在画了！');return}
    // setState(states.DRAWING)
    try {
      await fetchEventSource('/api/ai/image/flavor-style', {
        openWhenHidden: true,
        method: 'POST',
        body: JSON.stringify(props),
        onmessage(ev) { handleEvent(ev as any) },
        onclose: () => {
          setState(states.NOT_START)
        },
      });
      console.log("end")
    }catch (e) {
      console.error(e)
      setState(states.ERROR)
    }
  }
  // const debounced = useDebounce(generate, {immediate: true, wait: 300})
  const isDrawing = state === states.DRAWING
  const isSuccess = state === states.SUCCESS

  const save = () => {
    if(url) downloadURI(url)
  }
  return {
    state,
    tips,
    progress,
    url,
    save,
    generate: generate,
    isDrawing,
    isSuccess
  }

}