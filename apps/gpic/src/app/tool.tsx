'use client'
import FileUploader from "@/components/file-uploader";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {styles} from "@/app/styles";
import {Button} from "@/components/ui/button";
import {Layers, Minus, Pencil, Plus} from "lucide-react";
import {states, useGenerate} from "@/hooks/use-generate";
import React, {useState} from "react";
import {useFiles} from "@/hooks/use-file-upload";
import {useGenerateTasks} from "@/hooks/use-task";
import {cn} from "@/lib/utils";


const useGenImageForm = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyles, setStyle] = useState<string[]>([]);
  const [times, setTimes] = useState<number>(1);
  const {files} = useFiles()
  const toggleStyles = (id: string) => {
    const selected = selectedStyles.find(style => style === id)
    if(selected) {
      setStyle(s => s.filter(style => style !== id))

    }else {
      setStyle(s => [...s, id])
    }
  }
  const [batch, setBatch] = useState(false);

  const value = {
    files: files.filter(it => it.state === 'UPLOADED').map(it => it.url) as string[],
    style: selectedStyles,
    prompt: prompt,
    batch: batch,
    times: times
  }
  const add = (value: number) => {
    setTimes(times + value);
  }
  return {
    value: value,
    toggleStyles,
    setPrompt,
    setBatch,
    add,
    times
  }
}


export const Tool = () => {
  const {value, setPrompt, toggleStyles, setBatch, add} = useGenImageForm()
  const {generate, state, progress, url, save} = useGenerate()
  const {generateTask} = useGenerateTasks()
  const genTask = () => generateTask(value)
  return <>
    <FileUploader />
    <div className="mt-6 space-y-4">
      <div>
        <Label className="text-white mb-2 block">风格选择</Label>
        <ul className={'flex w-full overflow-scroll flex-wrap gap-2 my-2 text-sm font-medium mx-2'}>
          {
            styles.map(style =>
              <Button
              variant={'ghost'}
              className={cn(
                'flex items-center data-[selected=true]:bg-black/40 justify-center gap-1 rounded-full p-2 px-3 border border-white/50',
              )}
              key={style.id}
              data-selected={value.style.indexOf(style.id) !== -1}
              onClick={()=>toggleStyles(style.id)}>{style.name}</Button>)
          }
        </ul>
      </div>
      <div className="flex items-center justify-end w-full gap-2">
        {
          value.batch && <div className="flex items-center gap-2">
                <Button variant={'ghost'} size={'icon'} disabled={value.times < 2} onClick={() => add(-1)}><Minus/></Button>
                <span>{value.times}</span>
                <Button variant={'ghost'} size={'icon'} disabled={value.times > 9} onClick={() => add(1)}><Plus/></Button>
            </div>
        }
        <Button
          variant={'ghost'}
          className={cn(
          'flex items-center justify-center gap-1 rounded-full p-2 px-3 border border-white/50',
          value.batch && 'bg-primary/30'
          )}
          onClick={() => {setBatch(b => !b)}}
        >
          <Layers className={'w-4 h-4'}/><Label htmlFor={'batch'} className={'hidden md:inline'}>Batch</Label>
        </Button>
        <Button
          variant="ghost"
          className=" flex items-center justify-center gap-1 rounded-full p-2 px-3 border border-white/50"
          onClick={() => genTask()}
        >
          <Pencil className="h-4 w-4" /><span className={'hidden md:inline'}>Draw️</span>
        </Button>
      </div>
      {
        url ? (
          <div className={'w-64 min-h-64 mx-auto bg-black/20 rounded-lg relative overflow-hidden'}>
            {
              state === states.DRAWING &&
                <div
                    className={'absolute h-1 top-0 bg-white/80 rounded-lg left-0 transition-[width]'}
                    style={{width: `${progress}%`}}
                >
                </div>
            }
            <img className={'inset-0 rounded-lg'} src={url} />
            <button
              onClick={() => {save()}}
              className={'absolute px-2 m-2 py-1 w-fit bottom-0 right-0 bg-black/30 rounded-full'}
            >
              保存
            </button>
          </div>
        ):(
          <>
            {
              state !== states.NOT_START &&
                <div className={'w-64 h-64 mx-auto bg-black/20 rounded-lg relative'}>
                    <div
                        className={'absolute h-1 top-0 bg-white/80 rounded-lg left-0 transition-[width]'}
                        style={{width: `${progress}%`}}
                    >
                    </div>
                </div>
            }
          </>
        )
      }

    </div>
  </>
}